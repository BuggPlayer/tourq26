import { createOpenAI } from "@ai-sdk/openai";
import { generateObject, generateText } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { getClientIp, isToolsRateLimited } from "@/lib/tools-rate-limit";
import {
  interviewCandidateOutputSchema,
  interviewHiringOutputSchema,
} from "@/lib/tools/interview-output";
import { buildInterviewObjectUserPrompt, INTERVIEW_SYSTEM } from "@/lib/tools/interview-prompts";
import { buildUserPrompt, SYSTEM } from "@/lib/tools/prompts";
import {
  parseToolFields,
  runBodySchema,
  type InterviewFields,
  type InterviewTrackId,
  type LiveToolId,
} from "@/lib/tools/schemas";
import { isFeatureEnabled } from "@/lib/feature-flags";

export const maxDuration = 60;

function sortInterviewSections<T extends { track: string }>(
  sections: T[],
  trackOrder: InterviewTrackId[]
): T[] {
  const order = new Map(trackOrder.map((t, i) => [t, i]));
  return [...sections].sort((a, b) => {
    const ia = order.get(a.track as InterviewTrackId) ?? 99;
    const ib = order.get(b.track as InterviewTrackId) ?? 99;
    return ia - ib;
  });
}

export async function POST(request: NextRequest) {
  if (!(await isFeatureEnabled("marketing_tools"))) {
    return NextResponse.json(
      { error: "Tools are temporarily disabled." },
      { status: 503 },
    );
  }
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "AI tools are not configured. Set OPENAI_API_KEY." },
      { status: 503 }
    );
  }

  const ip = getClientIp(request);
  if (await isToolsRateLimited(ip)) {
    return NextResponse.json(
      { error: "Daily limit reached. Try again tomorrow or contact us for help." },
      { status: 429 }
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = runBodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { toolId, fields } = parsed.data;
  const fieldResult = parseToolFields(toolId as LiveToolId, fields);
  if (!fieldResult.ok) {
    return NextResponse.json({ error: fieldResult.error }, { status: 400 });
  }

  const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });

  if (toolId === "interview-prep") {
    const d = fieldResult.data as InterviewFields;
    const allowed = new Set(d.tracks);
    const schema =
      d.mode === "candidate" ? interviewCandidateOutputSchema : interviewHiringOutputSchema;
    const prompt = buildInterviewObjectUserPrompt(d);

    try {
      const { object } = await generateObject({
        model: openai("gpt-4o-mini"),
        schema,
        schemaName: d.mode === "candidate" ? "InterviewCandidatePrep" : "InterviewHiringPrep",
        schemaDescription:
          d.mode === "candidate"
            ? "Interview prep for job seekers with per-track Q&A"
            : "Interview planning for hiring managers",
        system: INTERVIEW_SYSTEM,
        prompt,
        maxOutputTokens: 4_096,
        temperature: 0.45,
      });

      const filteredSections = object.sections.filter((s) => allowed.has(s.track as InterviewTrackId));
      if (filteredSections.length === 0) {
        return NextResponse.json(
          { error: "Could not generate content for selected tracks. Try again." },
          { status: 502 }
        );
      }

      const sortedSections = sortInterviewSections(filteredSections, d.tracks);

      if (d.mode === "candidate") {
        const data = {
          ...object,
          sections: sortedSections,
        };
        return NextResponse.json({
          format: "structured" as const,
          mode: "candidate" as const,
          data,
        });
      }

      const data = {
        ...object,
        sections: sortedSections,
      };
      return NextResponse.json({
        format: "structured" as const,
        mode: "hiring" as const,
        data,
      });
    } catch (e) {
      console.error("tools/run interview:", e);
      return NextResponse.json(
        { error: "Generation failed. Please try again shortly." },
        { status: 502 }
      );
    }
  }

  const userPrompt = buildUserPrompt(toolId as LiveToolId, fieldResult.data);

  try {
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      system: SYSTEM,
      prompt: userPrompt,
      maxOutputTokens: 2_048,
      temperature: 0.6,
    });

    if (!text?.trim()) {
      return NextResponse.json(
        { error: "No output generated. Try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ text: text.trim() });
  } catch (e) {
    console.error("tools/run:", e);
    return NextResponse.json(
      { error: "Generation failed. Please try again shortly." },
      { status: 502 }
    );
  }
}

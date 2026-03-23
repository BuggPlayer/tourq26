import { NextResponse } from "next/server";
import { z } from "zod";
import { guardHubBackend } from "@/lib/hub/hub-backend-flag";
import { prisma } from "@/lib/hub/prisma";

const bodySchema = z.object({
  questionId: z.string(),
  choiceIndex: z.number().int().min(0),
});

export async function POST(req: Request) {
  const denied = await guardHubBackend();
  if (denied) return denied;

  try {
    const json = await req.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    const q = await prisma.question.findUnique({
      where: { id: parsed.data.questionId },
      select: { tests: true, type: true },
    });
    if (!q || q.type !== "QUIZ" || !q.tests) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const spec = JSON.parse(q.tests) as {
      correctIndex: number;
      explanation: string;
      options: string[];
    };
    const correct = spec.correctIndex === parsed.data.choiceIndex;
    return NextResponse.json({
      correct,
      explanation: spec.explanation,
      correctIndex: spec.correctIndex,
    });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

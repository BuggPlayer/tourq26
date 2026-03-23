import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/hub/auth";
import { evaluateSubmission } from "@/lib/hub/evaluate-submission";
import type { PistonLanguage } from "@/lib/hub/piston";
import { prisma } from "@/lib/hub/prisma";
import { guardHubBackend } from "@/lib/hub/hub-backend-flag";
import {
  assertCanSubmit,
  HUB_ALL_FREE_LAUNCH,
  incrementMonthlySubmissions,
} from "@/lib/hub/usage";

const bodySchema = z.object({
  questionId: z.string(),
  code: z.string(),
  language: z.enum(["javascript", "python", "java", "cpp", "go"]),
  uiHtml: z.string().optional(),
  systemDesignTypes: z.array(z.string()).optional(),
});

export async function POST(req: Request) {
  const denied = await guardHubBackend();
  if (denied) return denied;

  const session = await auth();
  const userId = session?.user?.id;
  const tier = session?.user?.subscriptionTier ?? "free";

  const gate = await assertCanSubmit(userId, tier);
  if (!gate.ok) {
    return NextResponse.json({ error: gate.message }, { status: 402 });
  }

  let body: z.infer<typeof bodySchema>;
  try {
    const json = await req.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    body = parsed.data;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const question = await prisma.question.findUnique({ where: { id: body.questionId } });
  if (!question) {
    return NextResponse.json({ error: "Question not found" }, { status: 404 });
  }

  const result = await evaluateSubmission({
    question,
    code: body.code,
    language: body.language as PistonLanguage,
    extra: {
      uiHtml: body.uiHtml,
      systemDesignTypes: body.systemDesignTypes,
    },
  });

  if (userId) {
    if (
      !HUB_ALL_FREE_LAUNCH &&
      tier !== "premium" &&
      tier !== "student"
    ) {
      await incrementMonthlySubmissions(userId);
    }
    const prev = await prisma.userProgress.findUnique({
      where: {
        userId_questionId: { userId, questionId: question.id },
      },
    });
    const attempts = (prev?.attempts ?? 0) + 1;
    const best = Math.max(prev?.score ?? 0, result.score);
    const newlySolved = result.passed && !prev?.solved;
    const solved = result.passed || prev?.solved;
    await prisma.userProgress.upsert({
      where: { userId_questionId: { userId, questionId: question.id } },
      create: {
        userId,
        questionId: question.id,
        attempts,
        score: result.score,
        solved: !!result.passed,
        lastCode: body.code.slice(0, 12000),
      },
      update: {
        attempts,
        score: best,
        solved: !!solved,
        lastCode: body.code.slice(0, 12000),
      },
    });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user) {
      const samples = user.scoreSamples + 1;
      const totalScoreSum = user.totalScoreSum + result.score;
      await prisma.user.update({
        where: { id: userId },
        data: {
          scoreSamples: samples,
          totalScoreSum,
          solvedCount: newlySolved ? { increment: 1 } : undefined,
          lastActiveDate: new Date(),
        },
      });
    }
  }

  return NextResponse.json(result);
}

import { NextResponse } from "next/server";
import { guardHubBackend } from "@/lib/hub/hub-backend-flag";
import { prisma } from "@/lib/hub/prisma";

export async function GET() {
  const denied = await guardHubBackend();
  if (denied) return denied;

  const count = await prisma.question.count({ where: { type: "QUIZ" } });
  if (count === 0) {
    return NextResponse.json({ error: "No quiz items" }, { status: 404 });
  }
  const skip = Math.floor(Math.random() * count);
  const q = await prisma.question.findFirst({
    where: { type: "QUIZ" },
    skip,
    select: {
      id: true,
      title: true,
      description: true,
      difficulty: true,
      topic: true,
      tests: true,
    },
  });
  if (!q?.tests) {
    return NextResponse.json({ error: "Malformed quiz" }, { status: 500 });
  }
  const spec = JSON.parse(q.tests) as {
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  return NextResponse.json({
    id: q.id,
    title: q.title,
    description: q.description,
    difficulty: q.difficulty,
    topic: q.topic,
    options: spec.options,
  });
}

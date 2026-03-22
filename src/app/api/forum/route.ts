import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/hub/auth";
import { prisma } from "@/lib/hub/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const questionId = searchParams.get("questionId");
  if (!questionId) {
    return NextResponse.json({ error: "questionId required" }, { status: 400 });
  }
  const threads = await prisma.forumThread.findMany({
    where: { questionId },
    orderBy: { createdAt: "desc" },
    include: {
      posts: {
        orderBy: { createdAt: "asc" },
        include: { user: { select: { name: true, image: true } } },
      },
    },
  });
  return NextResponse.json({ threads });
}

const threadSchema = z.object({
  questionId: z.string(),
  title: z.string().min(3).max(200),
  body: z.string().min(1).max(8000),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in to post" }, { status: 401 });
  }
  try {
    const json = await req.json();
    const parsed = threadSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid thread" }, { status: 400 });
    }
    const thread = await prisma.forumThread.create({
      data: {
        questionId: parsed.data.questionId,
        title: parsed.data.title,
        posts: {
          create: {
            userId: session.user.id,
            body: parsed.data.body,
          },
        },
      },
    });
    return NextResponse.json({ id: thread.id });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

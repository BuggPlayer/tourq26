import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/hub/auth";
import { guardHubBackend } from "@/lib/hub/hub-backend-flag";
import { prisma } from "@/lib/hub/prisma";

const bodySchema = z.object({
  threadId: z.string(),
  body: z.string().min(1).max(8000),
});

export async function POST(req: Request) {
  const denied = await guardHubBackend();
  if (denied) return denied;

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const json = await req.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid reply" }, { status: 400 });
    }
    await prisma.forumPost.create({
      data: {
        threadId: parsed.data.threadId,
        userId: session.user.id,
        body: parsed.data.body,
      },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

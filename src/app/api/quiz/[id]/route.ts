import { NextResponse } from "next/server";
import { guardHubBackend } from "@/lib/hub/hub-backend-flag";
import { prisma } from "@/lib/hub/prisma";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const denied = await guardHubBackend();
  if (denied) return denied;

  const { id } = await ctx.params;
  const q = await prisma.question.findFirst({
    where: { id, type: "QUIZ" },
    select: { id: true, title: true, description: true, tests: true },
  });
  if (!q?.tests) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const spec = JSON.parse(q.tests) as { options: string[] };
  return NextResponse.json({
    id: q.id,
    title: q.title,
    description: q.description,
    options: spec.options,
  });
}

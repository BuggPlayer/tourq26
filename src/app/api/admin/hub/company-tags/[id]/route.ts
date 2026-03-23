import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/hub/prisma";
import { revalidateInterviewHubContent } from "@/lib/admin/revalidate-hub";

const patchBody = z.object({
  name: z.string().min(1).max(120).optional(),
  category: z.string().min(1).max(120).optional(),
});

export async function PUT(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const json = await req.json().catch(() => null);
  const parsed = patchBody.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  try {
    const tag = await prisma.companyTag.update({
      where: { id },
      data: parsed.data,
    });
    revalidateInterviewHubContent();
    return NextResponse.json({ tag });
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 400 });
  }
}

export async function DELETE(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  await prisma.companyTag.delete({ where: { id } });
  revalidateInterviewHubContent();
  return NextResponse.json({ ok: true });
}

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/hub/prisma";
import { revalidateInterviewHubContent } from "@/lib/admin/revalidate-hub";

const patchBody = z.object({
  label: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional().nullable(),
  sortOrder: z.number().int().optional(),
});

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ bankSlug: string }> },
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { bankSlug } = await ctx.params;
  const decoded = decodeURIComponent(bankSlug);
  const json = await req.json().catch(() => null);
  const parsed = patchBody.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const row = await prisma.interviewQuestionBank.update({
    where: { slug: decoded },
    data: parsed.data,
  });
  revalidateInterviewHubContent();
  return NextResponse.json({ bank: row });
}

export async function DELETE(
  _req: NextRequest,
  ctx: { params: Promise<{ bankSlug: string }> },
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { bankSlug } = await ctx.params;
  const decoded = decodeURIComponent(bankSlug);
  await prisma.interviewQuestionBank.delete({ where: { slug: decoded } });
  revalidateInterviewHubContent();
  return NextResponse.json({ ok: true });
}

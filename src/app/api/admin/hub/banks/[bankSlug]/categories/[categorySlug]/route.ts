import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/hub/prisma";
import { revalidateInterviewHubContent } from "@/lib/admin/revalidate-hub";

const patchBody = z.object({
  label: z.string().min(1).max(200).optional(),
  sortOrder: z.number().int().optional(),
});

export async function PUT(
  req: NextRequest,
  ctx: { params: Promise<{ bankSlug: string; categorySlug: string }> },
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { bankSlug, categorySlug } = await ctx.params;
  const bank = await prisma.interviewQuestionBank.findUnique({
    where: { slug: decodeURIComponent(bankSlug) },
  });
  if (!bank) return NextResponse.json({ error: "Bank not found" }, { status: 404 });
  const catDecoded = decodeURIComponent(categorySlug);
  const json = await req.json().catch(() => null);
  const parsed = patchBody.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const row = await prisma.interviewBankCategory.update({
    where: {
      bankId_slug: { bankId: bank.id, slug: catDecoded },
    },
    data: parsed.data,
  });
  revalidateInterviewHubContent();
  return NextResponse.json({ category: row });
}

export async function DELETE(
  _req: NextRequest,
  ctx: { params: Promise<{ bankSlug: string; categorySlug: string }> },
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { bankSlug, categorySlug } = await ctx.params;
  const bank = await prisma.interviewQuestionBank.findUnique({
    where: { slug: decodeURIComponent(bankSlug) },
  });
  if (!bank) return NextResponse.json({ error: "Bank not found" }, { status: 404 });
  const catDecoded = decodeURIComponent(categorySlug);
  await prisma.interviewBankCategory.delete({
    where: {
      bankId_slug: { bankId: bank.id, slug: catDecoded },
    },
  });
  revalidateInterviewHubContent();
  return NextResponse.json({ ok: true });
}

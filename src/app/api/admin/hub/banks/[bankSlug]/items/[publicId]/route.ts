import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/hub/prisma";
import { revalidateInterviewHubContent } from "@/lib/admin/revalidate-hub";

const updateBody = z.object({
  categorySlug: z.string().min(1).optional(),
  question: z.string().min(1).optional(),
  answer: z.string().min(1).optional(),
  difficulty: z.string().optional().nullable(),
  categoryBadge: z.string().optional().nullable(),
  answerIntro: z.string().optional().nullable(),
  bulletsJson: z.string().optional().nullable(),
  codeExample: z.string().optional().nullable(),
  sourceName: z.string().optional().nullable(),
  sourceUrl: z.string().optional().nullable(),
  sortOrder: z.number().int().optional(),
});

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ bankSlug: string; publicId: string }> },
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { bankSlug, publicId } = await ctx.params;
  const bank = await prisma.interviewQuestionBank.findUnique({
    where: { slug: decodeURIComponent(bankSlug) },
  });
  if (!bank) return NextResponse.json({ error: "Bank not found" }, { status: 404 });
  const decoded = decodeURIComponent(publicId);
  const item = await prisma.interviewBankItem.findUnique({
    where: {
      bankId_publicId: { bankId: bank.id, publicId: decoded },
    },
    include: { category: true },
  });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ item });
}

export async function PUT(
  req: NextRequest,
  ctx: { params: Promise<{ bankSlug: string; publicId: string }> },
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { bankSlug, publicId } = await ctx.params;
  const bank = await prisma.interviewQuestionBank.findUnique({
    where: { slug: decodeURIComponent(bankSlug) },
  });
  if (!bank) return NextResponse.json({ error: "Bank not found" }, { status: 404 });
  const decoded = decodeURIComponent(publicId);
  const json = await req.json().catch(() => null);
  const parsed = updateBody.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const b = parsed.data;
  let categoryId: string | undefined;
  if (b.categorySlug) {
    const cat = await prisma.interviewBankCategory.findFirst({
      where: { bankId: bank.id, slug: b.categorySlug },
    });
    if (!cat) {
      return NextResponse.json({ error: "Unknown categorySlug for this bank" }, { status: 400 });
    }
    categoryId = cat.id;
  }
  const item = await prisma.interviewBankItem.update({
    where: {
      bankId_publicId: { bankId: bank.id, publicId: decoded },
    },
    data: {
      ...(categoryId ? { categoryId } : {}),
      ...(b.question !== undefined ? { question: b.question } : {}),
      ...(b.answer !== undefined ? { answer: b.answer } : {}),
      ...(b.difficulty !== undefined ? { difficulty: b.difficulty } : {}),
      ...(b.categoryBadge !== undefined ? { categoryBadge: b.categoryBadge } : {}),
      ...(b.answerIntro !== undefined ? { answerIntro: b.answerIntro } : {}),
      ...(b.bulletsJson !== undefined ? { bulletsJson: b.bulletsJson } : {}),
      ...(b.codeExample !== undefined ? { codeExample: b.codeExample } : {}),
      ...(b.sourceName !== undefined ? { sourceName: b.sourceName } : {}),
      ...(b.sourceUrl !== undefined ? { sourceUrl: b.sourceUrl } : {}),
      ...(b.sortOrder !== undefined ? { sortOrder: b.sortOrder } : {}),
    },
    include: { category: true },
  });
  revalidateInterviewHubContent();
  return NextResponse.json({ item });
}

export async function DELETE(
  _req: NextRequest,
  ctx: { params: Promise<{ bankSlug: string; publicId: string }> },
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { bankSlug, publicId } = await ctx.params;
  const bank = await prisma.interviewQuestionBank.findUnique({
    where: { slug: decodeURIComponent(bankSlug) },
  });
  if (!bank) return NextResponse.json({ error: "Bank not found" }, { status: 404 });
  const decoded = decodeURIComponent(publicId);
  await prisma.interviewBankItem.delete({
    where: {
      bankId_publicId: { bankId: bank.id, publicId: decoded },
    },
  });
  revalidateInterviewHubContent();
  return NextResponse.json({ ok: true });
}

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/hub/prisma";
import { revalidateInterviewHubContent } from "@/lib/admin/revalidate-hub";

const createBody = z.object({
  publicId: z.string().min(1).max(120),
  categorySlug: z.string().min(1),
  question: z.string().min(1),
  answer: z.string().min(1),
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
  ctx: { params: Promise<{ bankSlug: string }> },
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { bankSlug } = await ctx.params;
  const bank = await prisma.interviewQuestionBank.findUnique({
    where: { slug: decodeURIComponent(bankSlug) },
  });
  if (!bank) return NextResponse.json({ error: "Bank not found" }, { status: 404 });
  const items = await prisma.interviewBankItem.findMany({
    where: { bankId: bank.id },
    include: { category: true },
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json({ items });
}

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ bankSlug: string }> },
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { bankSlug } = await ctx.params;
  const bank = await prisma.interviewQuestionBank.findUnique({
    where: { slug: decodeURIComponent(bankSlug) },
  });
  if (!bank) return NextResponse.json({ error: "Bank not found" }, { status: 404 });

  const json = await req.json().catch(() => null);
  const parsed = createBody.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const b = parsed.data;
  const cat = await prisma.interviewBankCategory.findFirst({
    where: { bankId: bank.id, slug: b.categorySlug },
  });
  if (!cat) {
    return NextResponse.json({ error: "Unknown categorySlug for this bank" }, { status: 400 });
  }
  const exists = await prisma.interviewBankItem.findUnique({
    where: {
      bankId_publicId: { bankId: bank.id, publicId: b.publicId },
    },
  });
  if (exists) {
    return NextResponse.json({ error: "publicId already exists in this bank" }, { status: 409 });
  }
  const maxSort = await prisma.interviewBankItem.aggregate({
    where: { bankId: bank.id },
    _max: { sortOrder: true },
  });
  const sortOrder = b.sortOrder ?? (maxSort._max.sortOrder ?? -1) + 1;
  const row = await prisma.interviewBankItem.create({
    data: {
      bankId: bank.id,
      publicId: b.publicId,
      categoryId: cat.id,
      question: b.question,
      answer: b.answer,
      difficulty: b.difficulty ?? null,
      categoryBadge: b.categoryBadge ?? null,
      answerIntro: b.answerIntro ?? null,
      bulletsJson: b.bulletsJson ?? null,
      codeExample: b.codeExample ?? null,
      sourceName: b.sourceName ?? null,
      sourceUrl: b.sourceUrl ?? null,
      sortOrder,
    },
    include: { category: true },
  });
  revalidateInterviewHubContent();
  return NextResponse.json({ item: row });
}

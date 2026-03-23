import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/hub/prisma";
import { revalidateInterviewHubContent } from "@/lib/admin/revalidate-hub";

const createBody = z.object({
  slug: z.string().min(1).max(80).regex(/^[a-z0-9-]+$/),
  label: z.string().min(1).max(200),
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
  const categories = await prisma.interviewBankCategory.findMany({
    where: { bankId: bank.id },
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json({ categories });
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
  const dup = await prisma.interviewBankCategory.findFirst({
    where: { bankId: bank.id, slug: b.slug },
  });
  if (dup) {
    return NextResponse.json({ error: "slug already exists in this bank" }, { status: 409 });
  }
  const maxSort = await prisma.interviewBankCategory.aggregate({
    where: { bankId: bank.id },
    _max: { sortOrder: true },
  });
  const sortOrder = b.sortOrder ?? (maxSort._max.sortOrder ?? -1) + 1;
  const row = await prisma.interviewBankCategory.create({
    data: {
      bankId: bank.id,
      slug: b.slug,
      label: b.label,
      sortOrder,
    },
  });
  revalidateInterviewHubContent();
  return NextResponse.json({ category: row });
}

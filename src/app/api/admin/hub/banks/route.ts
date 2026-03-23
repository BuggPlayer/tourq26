import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/hub/prisma";
import { revalidateInterviewHubContent } from "@/lib/admin/revalidate-hub";

const createBody = z.object({
  slug: z.string().min(1).max(80).regex(/^[a-z0-9-]+$/),
  label: z.string().min(1).max(200),
  description: z.string().max(2000).optional().nullable(),
  sortOrder: z.number().int().optional(),
});

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const banks = await prisma.interviewQuestionBank.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { items: true, categories: true } } },
  });
  return NextResponse.json({ banks });
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const json = await req.json().catch(() => null);
  const parsed = createBody.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const b = parsed.data;
  const exists = await prisma.interviewQuestionBank.findUnique({
    where: { slug: b.slug },
  });
  if (exists) {
    return NextResponse.json({ error: "slug already exists" }, { status: 409 });
  }
  const maxSort = await prisma.interviewQuestionBank.aggregate({
    _max: { sortOrder: true },
  });
  const sortOrder = b.sortOrder ?? (maxSort._max.sortOrder ?? -1) + 1;
  const row = await prisma.interviewQuestionBank.create({
    data: {
      slug: b.slug,
      label: b.label,
      description: b.description ?? null,
      sortOrder,
    },
  });
  revalidateInterviewHubContent();
  return NextResponse.json({ bank: row });
}

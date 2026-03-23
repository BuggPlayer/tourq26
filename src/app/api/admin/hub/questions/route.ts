import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/hub/prisma";
import { revalidateInterviewHubContent } from "@/lib/admin/revalidate-hub";

const createBody = z.object({
  type: z.enum(["DSA", "UI", "QUIZ", "FRONTEND_SYSTEM_DESIGN"]),
  title: z.string().min(1),
  description: z.string(),
  difficulty: z.string(),
  topic: z.string(),
  framework: z.string().optional().nullable(),
  defaultLanguage: z.string().optional().nullable(),
  starterCode: z.string().optional().nullable(),
  tests: z.string().optional().nullable(),
  officialSolution: z.string().optional().nullable(),
  systemDesignMeta: z.string().optional().nullable(),
  companyTagNames: z.array(z.string()).optional(),
});

export async function GET(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const take = Math.min(Number(searchParams.get("take") ?? "80"), 200);
  const skip = Math.max(Number(searchParams.get("skip") ?? "0"), 0);
  const [questions, total] = await Promise.all([
    prisma.question.findMany({
      orderBy: { createdAt: "desc" },
      take,
      skip,
      select: {
        id: true,
        type: true,
        title: true,
        topic: true,
        difficulty: true,
        framework: true,
        createdAt: true,
      },
    }),
    prisma.question.count(),
  ]);
  return NextResponse.json({ questions, total, take, skip });
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
  const { companyTagNames, ...rest } = parsed.data;
  const tagMap = new Map<string, string>();
  if (companyTagNames?.length) {
    const tags = await prisma.companyTag.findMany({
      where: { name: { in: companyTagNames } },
    });
    for (const t of tags) tagMap.set(t.name, t.id);
    const missing = companyTagNames.filter((n) => !tagMap.has(n));
    if (missing.length) {
      return NextResponse.json({ error: `Unknown tags: ${missing.join(", ")}` }, { status: 400 });
    }
  }
  const linkCreates = (companyTagNames ?? []).map((name) => ({
    companyTagId: tagMap.get(name)!,
  }));
  const q = await prisma.question.create({
    data: {
      ...rest,
      companyTagLinks:
        linkCreates.length > 0 ? { create: linkCreates } : undefined,
    },
  });
  revalidateInterviewHubContent();
  return NextResponse.json({ question: q });
}

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/hub/prisma";
import { revalidateInterviewHubContent } from "@/lib/admin/revalidate-hub";

const patchBody = z.object({
  type: z.enum(["DSA", "UI", "QUIZ", "FRONTEND_SYSTEM_DESIGN"]).optional(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  difficulty: z.string().optional(),
  topic: z.string().optional(),
  framework: z.string().optional().nullable(),
  defaultLanguage: z.string().optional().nullable(),
  starterCode: z.string().optional().nullable(),
  tests: z.string().optional().nullable(),
  officialSolution: z.string().optional().nullable(),
  systemDesignMeta: z.string().optional().nullable(),
  companyTagNames: z.array(z.string()).optional(),
});

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const question = await prisma.question.findUnique({
    where: { id },
    include: {
      companyTagLinks: { include: { companyTag: true } },
    },
  });
  if (!question) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ question });
}

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
  const b = parsed.data;
  const { companyTagNames, ...scalar } = b;

  let companyTagLinks:
    | { deleteMany: Record<string, never>; create: { companyTagId: string }[] }
    | undefined;

  if (companyTagNames !== undefined) {
    const tagMap = new Map<string, string>();
    if (companyTagNames.length) {
      const tags = await prisma.companyTag.findMany({
        where: { name: { in: companyTagNames } },
      });
      for (const t of tags) tagMap.set(t.name, t.id);
      const missing = companyTagNames.filter((n) => !tagMap.has(n));
      if (missing.length) {
        return NextResponse.json({ error: `Unknown tags: ${missing.join(", ")}` }, { status: 400 });
      }
    }
    companyTagLinks = {
      deleteMany: {},
      create: companyTagNames.map((name) => ({ companyTagId: tagMap.get(name)! })),
    };
  }

  const question = await prisma.question.update({
    where: { id },
    data: {
      ...(scalar.type !== undefined ? { type: scalar.type } : {}),
      ...(scalar.title !== undefined ? { title: scalar.title } : {}),
      ...(scalar.description !== undefined ? { description: scalar.description } : {}),
      ...(scalar.difficulty !== undefined ? { difficulty: scalar.difficulty } : {}),
      ...(scalar.topic !== undefined ? { topic: scalar.topic } : {}),
      ...(scalar.framework !== undefined ? { framework: scalar.framework } : {}),
      ...(scalar.defaultLanguage !== undefined ? { defaultLanguage: scalar.defaultLanguage } : {}),
      ...(scalar.starterCode !== undefined ? { starterCode: scalar.starterCode } : {}),
      ...(scalar.tests !== undefined ? { tests: scalar.tests } : {}),
      ...(scalar.officialSolution !== undefined ? { officialSolution: scalar.officialSolution } : {}),
      ...(scalar.systemDesignMeta !== undefined ? { systemDesignMeta: scalar.systemDesignMeta } : {}),
      ...(companyTagLinks ? { companyTagLinks } : {}),
    },
    include: {
      companyTagLinks: { include: { companyTag: true } },
    },
  });
  revalidateInterviewHubContent();
  return NextResponse.json({ question });
}

export async function DELETE(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  await prisma.question.delete({ where: { id } });
  revalidateInterviewHubContent();
  return NextResponse.json({ ok: true });
}

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/hub/prisma";
import { revalidateInterviewHubContent } from "@/lib/admin/revalidate-hub";

const patchBody = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  durationDays: z.number().int().positive().optional(),
  milestones: z.string().optional(),
  sortOrder: z.number().int().optional(),
});

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ slug: string }> },
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { slug } = await ctx.params;
  const plan = await prisma.preparationPlan.findUnique({
    where: { slug: decodeURIComponent(slug) },
  });
  if (!plan) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ plan });
}

export async function PUT(
  req: NextRequest,
  ctx: { params: Promise<{ slug: string }> },
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { slug } = await ctx.params;
  const json = await req.json().catch(() => null);
  const parsed = patchBody.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const plan = await prisma.preparationPlan.update({
    where: { slug: decodeURIComponent(slug) },
    data: parsed.data,
  });
  revalidateInterviewHubContent();
  return NextResponse.json({ plan });
}

export async function DELETE(
  _req: NextRequest,
  ctx: { params: Promise<{ slug: string }> },
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { slug } = await ctx.params;
  await prisma.preparationPlan.delete({ where: { slug: decodeURIComponent(slug) } });
  revalidateInterviewHubContent();
  return NextResponse.json({ ok: true });
}

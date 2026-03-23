import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/hub/prisma";
import { revalidateInterviewHubContent } from "@/lib/admin/revalidate-hub";

const createBody = z.object({
  slug: z.string().min(1).max(120),
  name: z.string().min(1),
  description: z.string(),
  durationDays: z.number().int().positive(),
  milestones: z.string(),
  sortOrder: z.number().int().optional(),
});

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const plans = await prisma.preparationPlan.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ plans });
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
  const maxSort = await prisma.preparationPlan.aggregate({ _max: { sortOrder: true } });
  const sortOrder = b.sortOrder ?? (maxSort._max.sortOrder ?? -1) + 1;
  const plan = await prisma.preparationPlan.create({
    data: {
      slug: b.slug,
      name: b.name,
      description: b.description,
      durationDays: b.durationDays,
      milestones: b.milestones,
      sortOrder,
    },
  });
  revalidateInterviewHubContent();
  return NextResponse.json({ plan });
}

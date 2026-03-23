import { NextResponse } from "next/server";
import { guardHubBackend } from "@/lib/hub/hub-backend-flag";
import { prisma } from "@/lib/hub/prisma";

export async function GET() {
  const denied = await guardHubBackend();
  if (denied) return denied;

  const plans = await prisma.preparationPlan.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json({
    plans: plans.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      description: p.description,
      durationDays: p.durationDays,
      milestones: JSON.parse(p.milestones) as Array<{
        id: string;
        title: string;
        questionCount: number;
      }>,
    })),
  });
}

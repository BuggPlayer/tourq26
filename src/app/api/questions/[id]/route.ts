import { NextResponse } from "next/server";
import { auth } from "@/lib/hub/auth";
import { guardHubBackend } from "@/lib/hub/hub-backend-flag";
import { prisma } from "@/lib/hub/prisma";
import { needsPremiumGate } from "@/lib/hub/usage";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const denied = await guardHubBackend();
  if (denied) return denied;

  const { id } = await ctx.params;
  const session = await auth();
  const tier = session?.user?.subscriptionTier ?? "free";

  const q = await prisma.question.findUnique({
    where: { id },
    include: {
      companyTagLinks: { include: { companyTag: true } },
    },
  });
  if (!q) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (
    needsPremiumGate(tier) &&
    q.type === "FRONTEND_SYSTEM_DESIGN"
  ) {
    return NextResponse.json({ error: "Premium required" }, { status: 403 });
  }
  if (
    needsPremiumGate(tier) &&
    q.framework &&
    q.framework !== "vanilla"
  ) {
    return NextResponse.json({ error: "Premium required" }, { status: 403 });
  }

  return NextResponse.json({
    question: {
      id: q.id,
      type: q.type,
      title: q.title,
      description: q.description,
      difficulty: q.difficulty,
      topic: q.topic,
      framework: q.framework,
      defaultLanguage: q.defaultLanguage,
      starterCode: q.starterCode ? JSON.parse(q.starterCode) : null,
      officialSolution: q.officialSolution,
      systemDesignMeta: q.systemDesignMeta ? JSON.parse(q.systemDesignMeta) : null,
      companyTags: q.companyTagLinks.map((l) => l.companyTag),
    },
  });
}

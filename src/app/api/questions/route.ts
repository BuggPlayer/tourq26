import { NextResponse } from "next/server";
import { auth } from "@/lib/hub/auth";
import { guardHubBackend } from "@/lib/hub/hub-backend-flag";
import { prisma } from "@/lib/hub/prisma";
import { needsPremiumGate } from "@/lib/hub/usage";

export async function GET(req: Request) {
  const denied = await guardHubBackend();
  if (denied) return denied;

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") ?? undefined;
  const topic = searchParams.get("topic") ?? undefined;
  const difficulty = searchParams.get("difficulty") ?? undefined;
  const framework = searchParams.get("framework") ?? undefined;
  const company = searchParams.get("company") ?? undefined;

  const session = await auth();
  const tier = session?.user?.subscriptionTier ?? "free";

  const where: Record<string, unknown> = {};
  if (type) where.type = type;
  if (topic) where.topic = { contains: topic };
  if (difficulty) where.difficulty = difficulty;
  if (framework) where.framework = framework;
  if (company) {
    where.companyTagLinks = {
      some: { companyTag: { name: company } },
    };
  }

  if (needsPremiumGate(tier) && framework && framework !== "vanilla") {
    return NextResponse.json(
      { error: "Multi-framework UI practice requires Premium or verified student access." },
      { status: 403 },
    );
  }
  if (needsPremiumGate(tier) && type === "FRONTEND_SYSTEM_DESIGN") {
    return NextResponse.json(
      { error: "Frontend system design labs require Premium or verified student access." },
      { status: 403 },
    );
  }

  const rows = await prisma.question.findMany({
    where,
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      type: true,
      title: true,
      description: true,
      difficulty: true,
      topic: true,
      framework: true,
      defaultLanguage: true,
      companyTagLinks: {
        select: { companyTag: { select: { name: true, category: true } } },
      },
    },
  });

  const questions = rows.map(({ companyTagLinks, ...rest }) => ({
    ...rest,
    companyTags: companyTagLinks.map((l) => l.companyTag),
  }));

  return NextResponse.json({ questions });
}

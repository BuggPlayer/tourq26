import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/hub/auth";
import { guardHubBackend } from "@/lib/hub/hub-backend-flag";
import { prisma } from "@/lib/hub/prisma";
import { HUB_ALL_FREE_LAUNCH } from "@/lib/hub/usage";

/** Demo threshold: strong hub performance unlocks the talent pool opt-in. */
const MIN_AVG_SCORE = 78;
const MIN_SOLVED = 4;

const postSchema = z.object({
  optIn: z.boolean(),
  skills: z.array(z.string()).max(24).optional(),
  location: z.string().max(200).optional(),
  headline: z.string().max(240).optional(),
});

export async function GET(req: Request) {
  const denied = await guardHubBackend();
  if (denied) return denied;

  const { searchParams } = new URL(req.url);
  const skill = searchParams.get("skill") ?? undefined;
  const location = searchParams.get("location") ?? undefined;
  const minScore = Number(searchParams.get("minScore") ?? "0");

  const entries = await prisma.talentPoolEntry.findMany({
    where: {
      optIn: true,
      ...(location ? { location: { contains: location } } : {}),
    },
    include: {
      user: { select: { name: true, email: true, solvedCount: true } },
    },
    orderBy: { avgScore: "desc" },
    take: 60,
  });

  const filtered = entries.filter((e) => {
    if (e.avgScore < minScore) return false;
    if (!skill) return true;
    try {
      const skills = JSON.parse(e.skills) as string[];
      return skills.some((s) => s.toLowerCase().includes(skill.toLowerCase()));
    } catch {
      return false;
    }
  });

  return NextResponse.json({
    candidates: filtered.map((e) => ({
      id: e.id,
      headline: e.headline,
      location: e.location,
      avgScore: e.avgScore,
      percentile: e.percentile,
      skills: JSON.parse(e.skills || "[]") as string[],
      solvedCount: e.user.solvedCount,
      displayName: e.user.name ?? "Candidate",
      /** MVP: masked contact — replace with in-app messaging in production. */
      contactHint: e.user.email?.replace(/(^.).*(@.*$)/, "$1***$2") ?? "verified@hub",
    })),
  });
}

export async function POST(req: Request) {
  const denied = await guardHubBackend();
  if (denied) return denied;

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const json = await req.json();
    const parsed = postSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        totalScoreSum: true,
        scoreSamples: true,
        solvedCount: true,
      },
    });
    if (!user) {
      return NextResponse.json({ error: "User missing" }, { status: 400 });
    }
    const avg =
      user.scoreSamples > 0 ? user.totalScoreSum / user.scoreSamples : 0;
    if (
      !HUB_ALL_FREE_LAUNCH &&
      avg < MIN_AVG_SCORE &&
      user.solvedCount < MIN_SOLVED
    ) {
      return NextResponse.json(
        {
          error:
            "Talent pool is for top performers on the hub. Raise your average score or solve more challenges first.",
        },
        { status: 403 },
      );
    }
    const allScores = await prisma.user.findMany({
      where: { scoreSamples: { gt: 0 } },
      select: { totalScoreSum: true, scoreSamples: true },
    });
    const avgs = allScores
      .map((u) => u.totalScoreSum / u.scoreSamples)
      .sort((a, b) => a - b);
    const better = avgs.filter((v) => v < avg).length;
    const percentile =
      avgs.length === 0 ? 100 : Math.round((better / avgs.length) * 100);

    await prisma.talentPoolEntry.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        optIn: parsed.data.optIn,
        avgScore: avg,
        percentile,
        skills: JSON.stringify(parsed.data.skills ?? []),
        location: parsed.data.location ?? "",
        headline: parsed.data.headline ?? "",
      },
      update: {
        optIn: parsed.data.optIn,
        avgScore: avg,
        percentile,
        skills: JSON.stringify(parsed.data.skills ?? []),
        location: parsed.data.location ?? "",
        headline: parsed.data.headline ?? "",
      },
    });
    return NextResponse.json({ ok: true, avgScore: avg, percentile });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

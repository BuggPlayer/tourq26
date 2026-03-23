import { CandidateDashboardShell } from "@/components/hub/CandidateDashboardShell";
import { auth } from "@/lib/hub/auth";
import { isHubBackendFull } from "@/lib/hub/hub-backend-flag";
import { listInterviewBanksPublic } from "@/lib/hub/interview-bank-data";
import { prisma } from "@/lib/hub/prisma";

export default async function CandidateDashboardPage() {
  const session = await auth();
  let stats = {
    solved: 0,
    avg: 0,
    streak: 0,
  };
  if (session?.user?.id && (await isHubBackendFull())) {
    const u = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        solvedCount: true,
        totalScoreSum: true,
        scoreSamples: true,
        streakDays: true,
      },
    });
    if (u) {
      stats = {
        solved: u.solvedCount,
        avg: u.scoreSamples > 0 ? Math.round(u.totalScoreSum / u.scoreSamples) : 0,
        streak: u.streakDays,
      };
    }
  }

  const interviewBanks = await listInterviewBanksPublic();

  return <CandidateDashboardShell stats={stats} interviewBanks={interviewBanks} />;
}

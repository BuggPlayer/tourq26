"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CandidateExplorer } from "@/components/hub/CandidateExplorer";
import { CandidateInterviewTracks } from "@/components/hub/CandidateInterviewTracks";
import { QuizWidget } from "@/components/hub/QuizWidget";
import { getNodeJsQAById } from "@/data/nodejs-interview-qa";
import {
  type CandidateBehaviorV1,
  recordCandidatePath,
} from "@/lib/hub/candidate-behavior";

type Stats = {
  solved: number;
  avg: number;
  streak: number;
};

export function CandidateDashboardShell({ stats }: { stats: Stats }) {
  const [behavior, setBehavior] = useState<CandidateBehaviorV1 | null>(null);

  useEffect(() => {
    setBehavior(recordCandidatePath("/hub/candidate"));
  }, []);

  const continueItems = useMemo(() => {
    if (!behavior?.recentNodeQaIds?.length) return [];
    const out: { id: string; question: string; href: string }[] = [];
    for (const { id } of behavior.recentNodeQaIds.slice(0, 4)) {
      const q = getNodeJsQAById(id);
      if (q) {
        out.push({
          id,
          question: q.question,
          href: `/hub/candidate/nodejs-interview/${id}`,
        });
      }
    }
    return out;
  }, [behavior]);

  return (
    <div className="space-y-10">
      <header>
        <h1 className="font-display text-3xl font-bold text-white">Candidate hub</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Open a JS / Node question via <strong className="font-medium text-slate-300">Full page</strong>{" "}
          for split view: reading on the left, Monaco on the right. After that,
          your recent questions show up in <strong className="font-medium text-slate-300">Continue reading</strong>{" "}
          below (saved on this device).
        </p>
        <Link
          href="/hub/candidate/nodejs-interview"
          className="mt-4 inline-flex items-center gap-2 rounded-xl border border-cyan-900/50 bg-cyan-950/30 px-4 py-3 text-sm font-medium text-cyan-200 transition-colors hover:border-cyan-700/50 hover:bg-cyan-950/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
        >
          JavaScript &amp; Node.js interview Q&amp;A
          <span className="text-cyan-500/80" aria-hidden>
            →
          </span>
        </Link>
      </header>

      {continueItems.length > 0 ? (
        <section
          className="rounded-2xl border border-slate-700/80 bg-slate-900/60 p-5"
          aria-label="Continue where you left off"
        >
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Continue reading
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Recent full-page Q&amp;A views on this device.
          </p>
          <ul className="mt-3 space-y-2">
            {continueItems.map((row) => (
              <li key={row.id}>
                <Link
                  href={row.href}
                  className="block rounded-lg border border-transparent px-3 py-2 text-sm text-slate-200 transition-colors hover:border-cyan-900/50 hover:bg-slate-950/50 hover:text-cyan-200"
                >
                  {row.question}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <CandidateInterviewTracks />

      <section
        className="grid gap-4 sm:grid-cols-3"
        aria-label="Progress summary"
      >
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Solved</p>
          <p className="stat-number mt-1 text-3xl font-bold">{stats.solved}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Avg score</p>
          <p className="stat-number mt-1 text-3xl font-bold">{stats.avg}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Streak</p>
          <p className="stat-number mt-1 text-3xl font-bold">{stats.streak}d</p>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <CandidateExplorer />
        <aside className="space-y-6">
          <QuizWidget />
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-sm text-slate-400">
            <h2 className="font-semibold text-slate-200">Preparation plans</h2>
            <p className="mt-2">
              Structured 1 week, 1 month, 3 month, and campus tracks with
              milestones.
            </p>
            <Link
              href="/hub/candidate/plans"
              className="mt-3 inline-block text-cyan-400 hover:underline"
            >
              View plans →
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

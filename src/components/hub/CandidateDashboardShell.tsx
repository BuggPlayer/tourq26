"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CandidateExplorer } from "@/components/hub/CandidateExplorer";
import { CandidateInterviewTracks } from "@/components/hub/CandidateInterviewTracks";
import { QuizWidget } from "@/components/hub/QuizWidget";
import {
  type CandidateBehaviorV1,
  recordCandidatePath,
} from "@/lib/hub/candidate-behavior";
import type { InterviewBankSummary } from "@/lib/hub/interview-bank-data";

type Stats = {
  solved: number;
  avg: number;
  streak: number;
};

type ResolvedRow = { bankSlug: string; id: string; question: string };

export function CandidateDashboardShell({
  stats,
  interviewBanks,
}: {
  stats: Stats;
  interviewBanks: InterviewBankSummary[];
}) {
  const [behavior, setBehavior] = useState<CandidateBehaviorV1 | null>(null);
  const [resolvedTitles, setResolvedTitles] = useState<ResolvedRow[]>([]);

  useEffect(() => {
    setBehavior(recordCandidatePath("/hub/candidate"));
  }, []);

  useEffect(() => {
    const entries = behavior?.recentInterviewQa ?? [];
    if (!entries.length) {
      setResolvedTitles([]);
      return;
    }
    const byBank = new Map<string, string[]>();
    for (const e of entries) {
      if (!byBank.has(e.bankSlug)) byBank.set(e.bankSlug, []);
      const arr = byBank.get(e.bankSlug)!;
      if (!arr.includes(e.id)) arr.push(e.id);
    }
    let cancelled = false;
    Promise.all(
      [...byBank.entries()].map(async ([bank, ids]) => {
        const res = await fetch(
          `/api/hub/interview/resolve?bank=${encodeURIComponent(bank)}&ids=${encodeURIComponent(ids.join(","))}`,
        );
        const d = (await res.json()) as { items?: { id: string; question: string }[] };
        return (d.items ?? []).map((it) => ({ ...it, bankSlug: bank }));
      }),
    )
      .then((chunks) => {
        if (!cancelled) setResolvedTitles(chunks.flat());
      })
      .catch(() => {
        if (!cancelled) setResolvedTitles([]);
      });
    return () => {
      cancelled = true;
    };
  }, [behavior]);

  const continueItems = useMemo(() => {
    const recent = behavior?.recentInterviewQa ?? [];
    if (!recent.length) return [];
    const byKey = new Map(
      resolvedTitles.map((r) => [`${r.bankSlug}:${r.id}`, r.question]),
    );
    const out: { bankSlug: string; id: string; question: string; href: string }[] = [];
    for (const { bankSlug, id } of recent.slice(0, 4)) {
      const question = byKey.get(`${bankSlug}:${id}`);
      if (question) {
        out.push({
          bankSlug,
          id,
          question,
          href: `/hub/candidate/interview/${bankSlug}/${encodeURIComponent(id)}`,
        });
      }
    }
    return out;
  }, [behavior, resolvedTitles]);

  return (
    <div className="space-y-10">
      <header>
        <h1 className="font-display text-3xl font-bold text-foreground">Candidate hub</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Open an interview Q&amp;A via <strong className="font-medium text-foreground/90">Full page</strong>{" "}
          for split view: reading on the left, Monaco on the right. After that,
          your recent questions show up in <strong className="font-medium text-foreground/90">Continue reading</strong>{" "}
          below (saved on this device).
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/hub/candidate/interview"
            className="inline-flex items-center gap-2 rounded-xl border border-cyan-900/50 bg-cyan-950/30 px-4 py-3 text-sm font-medium text-primary transition-colors hover:border-cyan-700/50 hover:bg-cyan-950/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
          >
            All interview Q&amp;A banks
            <span className="text-primary/80" aria-hidden>
              →
            </span>
          </Link>
          {interviewBanks.map((b) => (
            <Link
              key={b.slug}
              href={`/hub/candidate/interview/${b.slug}`}
              className="inline-flex items-center rounded-xl border border-border/80 bg-surface/40 px-3 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:border-primary/40 hover:text-primary"
            >
              {b.label}
            </Link>
          ))}
        </div>
      </header>

      {continueItems.length > 0 ? (
        <section
          className="rounded-2xl border border-border/80 bg-surface/60 p-5"
          aria-label="Continue where you left off"
        >
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Continue reading
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Recent full-page Q&amp;A views on this device.
          </p>
          <ul className="mt-3 space-y-2">
            {continueItems.map((row) => (
              <li key={`${row.bankSlug}:${row.id}`}>
                <Link
                  href={row.href}
                  className="block rounded-lg border border-transparent px-3 py-2 text-sm text-slate-200 transition-colors hover:border-cyan-900/50 hover:bg-background/50 hover:text-primary"
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
        <div className="rounded-xl border border-border bg-surface/50 p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Solved</p>
          <p className="stat-number mt-1 text-3xl font-bold">{stats.solved}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface/50 p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Avg score</p>
          <p className="stat-number mt-1 text-3xl font-bold">{stats.avg}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface/50 p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Streak</p>
          <p className="stat-number mt-1 text-3xl font-bold">{stats.streak}d</p>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <CandidateExplorer />
        <aside className="space-y-6">
          <QuizWidget />
          <div className="rounded-xl border border-border bg-surface/40 p-4 text-sm text-muted-foreground">
            <h2 className="font-semibold text-slate-200">Preparation plans</h2>
            <p className="mt-2">
              Structured 1 week, 1 month, 3 month, and campus tracks with
              milestones.
            </p>
            <Link
              href="/hub/candidate/plans"
              className="mt-3 inline-block text-primary hover:underline"
            >
              View plans →
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

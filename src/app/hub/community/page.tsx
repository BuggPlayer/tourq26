"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Q = { id: string; title: string; type: string };

export default function CommunityPage() {
  const [questions, setQuestions] = useState<Q[]>([]);
  useEffect(() => {
    fetch("/api/questions")
      .then((r) => r.json())
      .then((d) => setQuestions(d.questions ?? []));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold text-white">Community</h1>
      <p className="text-sm text-slate-400">
        Per-question discussion threads. Pick a problem to read or start a
        thread.
      </p>
      <section aria-labelledby="live-title">
        <h2 id="live-title" className="text-lg font-semibold text-slate-200">
          Live sessions (MVP)
        </h2>
        <ul className="mt-2 list-disc pl-5 text-sm text-slate-400">
          <li>
            Weekly frontend system design office hours — Zoom link announced in
            Discord (static placeholder).
          </li>
          <li>
            DSA walkthrough Sundays 10:00 IST — add{" "}
            <code className="text-cyan-500">NEXT_PUBLIC_LIVE_SESSION_URL</code>{" "}
            later for dynamic schedules.
          </li>
        </ul>
      </section>
      <ul className="space-y-2" role="list">
        {questions.map((q) => (
          <li key={q.id}>
            <Link
              href={`/hub/community/${q.id}`}
              className="block rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-3 text-sm hover:border-cyan-900/40"
            >
              <span className="text-xs text-cyan-500">{q.type}</span>
              <span className="ml-2 text-slate-200">{q.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

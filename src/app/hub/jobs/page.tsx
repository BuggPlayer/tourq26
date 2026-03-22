"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Job = {
  id: string;
  companyName: string;
  title: string;
  description: string;
  location: string;
  skills: string[];
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  useEffect(() => {
    fetch("/api/jobs")
      .then((r) => r.json())
      .then((d) => setJobs(d.jobs ?? []));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-bold text-white">Job board</h1>
        <Link
          href="/hub/jobs/new"
          className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white"
        >
          Post a job
        </Link>
      </div>
      <ul className="space-y-3" role="list">
        {jobs.map((j) => (
          <li
            key={j.id}
            className="rounded-xl border border-slate-800 bg-slate-900/40 p-4"
          >
            <h2 className="font-semibold text-slate-100">{j.title}</h2>
            <p className="text-xs text-slate-500">
              {j.companyName} · {j.location}
            </p>
            <p className="mt-2 line-clamp-3 text-sm text-slate-400">{j.description}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {j.skills.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300"
                >
                  {s}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

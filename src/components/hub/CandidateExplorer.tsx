"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Q = {
  id: string;
  type: string;
  title: string;
  difficulty: string;
  topic: string;
  framework: string | null;
  companyTags: { name: string; category: string }[];
};

export function CandidateExplorer() {
  const [filters, setFilters] = useState({
    type: "",
    topic: "",
    difficulty: "",
    framework: "",
    company: "",
  });
  const [list, setList] = useState<Q[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const qs = new URLSearchParams();
    if (filters.type) qs.set("type", filters.type);
    if (filters.topic) qs.set("topic", filters.topic);
    if (filters.difficulty) qs.set("difficulty", filters.difficulty);
    if (filters.framework) qs.set("framework", filters.framework);
    if (filters.company) qs.set("company", filters.company);
    fetch(`/api/questions?${qs}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error);
        else {
          setError(null);
          setList(d.questions ?? []);
        }
      })
      .catch(() => setError("Failed to load questions"));
  }, [filters]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <label className="text-xs text-muted-foreground">
          Type
          <select
            className="mt-1 w-full rounded-lg border border-border bg-background px-2 py-2 text-sm"
            value={filters.type}
            onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
            aria-label="Filter by question type"
          >
            <option value="">All</option>
            <option value="DSA">Coding (DSA)</option>
            <option value="UI">UI</option>
            <option value="QUIZ">Quiz</option>
            <option value="FRONTEND_SYSTEM_DESIGN">System design</option>
          </select>
        </label>
        <label className="text-xs text-muted-foreground">
          Difficulty
          <select
            className="mt-1 w-full rounded-lg border border-border bg-background px-2 py-2 text-sm"
            value={filters.difficulty}
            onChange={(e) =>
              setFilters((f) => ({ ...f, difficulty: e.target.value }))
            }
            aria-label="Filter by difficulty"
          >
            <option value="">All</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </label>
        <label className="text-xs text-muted-foreground">
          Framework (UI)
          <select
            className="mt-1 w-full rounded-lg border border-border bg-background px-2 py-2 text-sm"
            value={filters.framework}
            onChange={(e) =>
              setFilters((f) => ({ ...f, framework: e.target.value }))
            }
            aria-label="Filter by framework"
          >
            <option value="">All</option>
            <option value="vanilla">Vanilla</option>
            <option value="react">React</option>
            <option value="vue">Vue</option>
            <option value="angular">Angular</option>
            <option value="svelte">Svelte</option>
          </select>
        </label>
        <label className="text-xs text-muted-foreground">
          Topic contains
          <input
            className="mt-1 w-full rounded-lg border border-border bg-background px-2 py-2 text-sm"
            value={filters.topic}
            onChange={(e) => setFilters((f) => ({ ...f, topic: e.target.value }))}
            placeholder="e.g. arrays"
            aria-label="Filter by topic text"
          />
        </label>
        <label className="text-xs text-muted-foreground">
          Company tag
          <input
            className="mt-1 w-full rounded-lg border border-border bg-background px-2 py-2 text-sm"
            value={filters.company}
            onChange={(e) =>
              setFilters((f) => ({ ...f, company: e.target.value }))
            }
            placeholder="Google, Flipkart…"
            aria-label="Filter by company tag"
          />
        </label>
      </div>
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      <ul className="space-y-2" role="list">
        {list.map((q) => (
          <li key={q.id}>
            <Link
              href={
                q.type === "DSA"
                  ? `/hub/candidate/coding/${q.id}`
                  : q.type === "UI"
                    ? `/hub/candidate/ui/${q.id}`
                    : q.type === "FRONTEND_SYSTEM_DESIGN"
                      ? `/hub/candidate/system-design/${q.id}`
                      : `/hub/candidate/quiz?q=${q.id}`
              }
              className="flex flex-col rounded-xl border border-border bg-surface/40 p-4 transition hover:border-primary/40 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <span className="text-xs font-medium uppercase text-primary">
                  {q.type}
                </span>
                <h3 className="font-medium text-foreground">{q.title}</h3>
                <p className="text-xs text-muted-foreground">
                  {q.topic} · {q.difficulty}
                  {q.framework ? ` · ${q.framework}` : ""}
                </p>
              </div>
              <div className="mt-2 flex flex-wrap gap-1 sm:mt-0">
                {q.companyTags.map((c) => (
                  <span
                    key={c.name}
                    className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-foreground/90"
                  >
                    {c.name}
                  </span>
                ))}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

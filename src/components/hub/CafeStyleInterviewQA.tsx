"use client";

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { NodeJsInterviewAnswer } from "@/components/hub/NodeJsInterviewAnswer";
import {
  NODEJS_QA_CATEGORIES,
  searchableTextForItem,
  type NodeJsQAItem,
} from "@/data/nodejs-interview-qa";

type Props = {
  items: NodeJsQAItem[];
  /** When omitted, uses bundled default categories (must match item.categoryId values). */
  categories?: readonly { id: string; label: string }[];
  /** Public list URL base, e.g. `/hub/candidate/interview/nodejs` */
  basePath?: string;
  hubTitle?: string;
  /** Intro under the title; defaults to the legacy Node.js marketing blurb. */
  hubTagline?: ReactNode;
  /** Shown in answer CTAs, e.g. “JavaScript & Node.js” */
  ctaBankLabel?: string;
};

const DIFF_BADGE: Record<string, string> = {
  Easy: "bg-success/15 text-success",
  Mid: "bg-primary/15 text-primary",
  Hard: "bg-destructive/15 text-destructive",
};

export function CafeStyleInterviewQA({
  items,
  categories = NODEJS_QA_CATEGORIES,
  basePath = "/hub/candidate/interview/nodejs",
  hubTitle = "JavaScript & Node.js interview questions",
  hubTagline = (
    <>
      Browse by topic, search, and expand answers — similar in spirit to banks like{" "}
      <a
        href="https://www.fullstack.cafe/interview-questions/nodejs"
        target="_blank"
        rel="noopener noreferrer"
        className="hub-qa-link font-medium underline-offset-2 hover:underline"
      >
        FullStack.Cafe (Node.js)
      </a>
      , with{" "}
      <strong style={{ color: "var(--hub-page-fg, #e2e8f0)" }}>TorqStudio-written</strong>{" "}
      answers. Open a question for the full-page view. Pair with the{" "}
      <Link href="/hub/candidate" className="hub-qa-link font-medium underline-offset-2 hover:underline">
        coding tracks
      </Link>{" "}
      to practice in the editor.
    </>
  ),
  ctaBankLabel = "JavaScript & Node.js",
}: Props) {
  const [categoryId, setCategoryId] = useState<string>("all");
  const [query, setQuery] = useState("");

  const globalNumById = useMemo(() => {
    const m = new Map<string, number>();
    items.forEach((it, i) => m.set(it.id, i + 1));
    return m;
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (categoryId !== "all" && item.categoryId !== categoryId) return false;
      if (!q) return true;
      return searchableTextForItem(item).includes(q);
    });
  }, [items, categoryId, query]);

  const countByCategory = useMemo(() => {
    const m = new Map<string, number>();
    for (const i of items) {
      m.set(i.categoryId, (m.get(i.categoryId) ?? 0) + 1);
    }
    return m;
  }, [items]);

  const total = items.length;

  return (
    <div className="min-h-[60vh]">
      <header className="border-b pb-6" style={{ borderColor: "var(--hub-border, #1e293b)" }}>
        <nav aria-label="Breadcrumb">
          <Link
            href="/hub/candidate"
            className="hub-qa-link text-sm font-medium underline-offset-2 hover:underline"
          >
            ← Candidate hub
          </Link>
        </nav>
        <h1
          className="mt-4 font-display text-3xl font-bold tracking-tight md:text-4xl"
          style={{ color: "var(--hub-page-fg, #f8fafc)" }}
        >
          {hubTitle}
        </h1>
        <p
          className="mt-3 max-w-3xl text-sm leading-relaxed"
          style={{ color: "var(--hub-muted, #94a3b8)" }}
        >
          {hubTagline}
        </p>
      </header>

      <div className="mt-8 lg:grid lg:grid-cols-[minmax(200px,240px)_1fr] lg:gap-10">
        <nav className="mb-8 lg:mb-0" aria-label="Question categories">
          <p
            className="mb-3 text-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--hub-muted, #64748b)" }}
          >
            Topics
          </p>
          <ul
            className="space-y-0.5 rounded-xl border p-2 lg:sticky lg:top-24"
            style={{
              borderColor: "var(--hub-border, #1e293b)",
              backgroundColor:
                "color-mix(in srgb, var(--hub-elevated, #0f172a) 88%, transparent)",
            }}
          >
            {categories.map((c) => {
              const count =
                c.id === "all" ? items.length : (countByCategory.get(c.id) ?? 0);
              const active = categoryId === c.id;
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => setCategoryId(c.id)}
                    className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      active
                        ? "bg-primary/15 font-medium text-primary"
                        : "opacity-90 hover:bg-foreground/5"
                    }`}
                    style={
                      !active
                        ? { color: "var(--hub-page-fg, #e2e8f0)" }
                        : undefined
                    }
                  >
                    <span>{c.label}</span>
                    <span
                      className={`tabular-nums text-xs ${
                        active ? "text-primary/80" : ""
                      }`}
                      style={
                        !active
                          ? { color: "var(--hub-muted, #64748b)" }
                          : undefined
                      }
                    >
                      {count}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="sr-only" htmlFor="qa-search">
              Search questions
            </label>
            <input
              id="qa-search"
              type="search"
              placeholder="Search questions & answers…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full max-w-xl rounded-xl border px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              style={{
                borderColor: "var(--hub-border, #334155)",
                backgroundColor:
                  "color-mix(in srgb, var(--hub-page-bg, #020617) 70%, #0f172a)",
                color: "var(--hub-page-fg, #f1f5f9)",
              }}
              autoComplete="off"
            />
            <p
              className="text-xs"
              style={{ color: "var(--hub-muted, #64748b)" }}
              aria-live="polite"
            >
              Showing {filtered.length} of {items.length} questions
            </p>
          </div>

          <ol className="space-y-2" role="list">
            {filtered.map((item) => {
              const qNum = globalNumById.get(item.id) ?? 0;
              const categoryLabel =
                categories.find((c) => c.id === item.categoryId)?.label ??
                item.categoryId;
              const badgeLabel = item.categoryBadge ?? categoryLabel;
              return (
                <li key={item.id}>
                  <Disclosure
                    as="div"
                    className="rounded-xl border transition-colors hover:border-border"
                    style={{
                      borderColor: "var(--hub-border, #1e293b)",
                      backgroundColor:
                        "color-mix(in srgb, var(--hub-elevated, #0f172a) 55%, transparent)",
                    }}
                  >
                    {({ open }) => (
                      <>
                        <div className="flex w-full flex-col gap-3 px-4 py-4 sm:flex-row sm:items-start sm:justify-between sm:px-5">
                          <DisclosureButton className="flex w-full flex-1 items-start gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary">
                            <span
                              className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-mono text-primary"
                              aria-hidden
                            >
                              {qNum}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span
                                className="block font-medium"
                                style={{ color: "var(--hub-page-fg, #f1f5f9)" }}
                              >
                                {item.question}
                              </span>
                              <span
                                className="mt-1 block text-xs"
                                style={{ color: "var(--hub-muted, #64748b)" }}
                              >
                                {categoryLabel}
                                {" · "}
                                <span className="font-medium text-primary/90">
                                  {open ? "Hide answer" : "Show answer"}
                                </span>
                              </span>
                            </span>
                            <span
                              className={`mt-1 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
                              aria-hidden
                            >
                              ▼
                            </span>
                          </DisclosureButton>
                          <div className="flex shrink-0 flex-wrap items-center gap-2 pl-10 sm:pl-0">
                            {item.difficulty ? (
                              <span
                                className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${DIFF_BADGE[item.difficulty] ?? "bg-muted text-muted-foreground"}`}
                              >
                                {item.difficulty}
                              </span>
                            ) : null}
                            <span className="rounded-md bg-muted/90 px-2 py-0.5 text-[11px] font-medium text-foreground/90">
                              {badgeLabel} {total}
                            </span>
                            <Link
                              href={`${basePath.replace(/\/$/, "")}/${encodeURIComponent(item.id)}`}
                              className="rounded-md border border-border px-2 py-0.5 text-[11px] font-medium text-foreground/90 hover:border-primary/60 hover:text-primary"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Full page
                            </Link>
                          </div>
                        </div>
                        <DisclosurePanel
                          className="border-t px-4 pb-5 pt-0 sm:px-5"
                          style={{ borderColor: "var(--hub-border, #1e293b)" }}
                        >
                          <div className="ml-0 border-l-2 border-primary/35 pl-4 sm:ml-10 sm:pl-5">
                            <div className="pt-4">
                              <NodeJsInterviewAnswer
                                item={item}
                                totalBankCount={total}
                                showCta={false}
                                listHref={basePath}
                                ctaBankLabel={ctaBankLabel}
                              />
                            </div>
                          </div>
                        </DisclosurePanel>
                      </>
                    )}
                  </Disclosure>
                </li>
              );
            })}
          </ol>

          {filtered.length === 0 && (
            <p
              className="rounded-xl border border-dashed py-12 text-center text-sm"
              style={{
                borderColor: "var(--hub-border, #334155)",
                color: "var(--hub-muted, #64748b)",
                backgroundColor:
                  "color-mix(in srgb, var(--hub-elevated, #0f172a) 40%, transparent)",
              }}
            >
              No questions match your filters. Try another topic or clear search.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

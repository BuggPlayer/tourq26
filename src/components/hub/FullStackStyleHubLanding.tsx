"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import type { HubLandingStats } from "@/lib/hub/hub-landing-stats";

type TabId = "fullstack" | "algorithms" | "system";

type Swatch = "amber" | "sky" | "emerald" | "purple";

const SWATCH_CLASS: Record<Swatch, string> = {
  amber: "hub-swatch-amber",
  sky: "hub-swatch-sky",
  emerald: "hub-swatch-emerald",
  purple: "hub-swatch-purple",
};

type Tag = { label: string; count: number; href: string; icon: string };

function TagPill({ tag }: { tag: Tag }) {
  return (
    <Link
      href={tag.href}
      title={`${tag.label} — ${tag.count} items`}
      className="group inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--hub-primary,#0891b2)] group-hover:border-[color:var(--hub-primary,#0891b2)]"
      style={{
        borderColor: "var(--hub-border, #334155)",
        backgroundColor:
          "color-mix(in srgb, var(--hub-elevated, #0f172a) 94%, transparent)",
        color: "var(--hub-page-fg, #f1f5f9)",
      }}
    >
      <span
        className="flex h-6 w-6 items-center justify-center rounded-md text-xs transition-colors group-hover:bg-[color-mix(in_srgb,var(--hub-primary)_20%,transparent)]"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--hub-page-bg) 70%, var(--hub-muted))",
        }}
      >
        {tag.icon}
      </span>
      <span>
        {tag.label}{" "}
        <span className="hub-text-accent font-semibold tabular-nums">
          {tag.count}
        </span>
      </span>
    </Link>
  );
}

export function FullStackStyleHubLanding({ stats }: { stats: HubLandingStats }) {
  const { data } = useSession();
  const [tab, setTab] = useState<TabId>("fullstack");
  const [hiringMode, setHiringMode] = useState(false);

  const surface = {
    borderColor: "var(--hub-border, #334155)",
    backgroundColor:
      "color-mix(in srgb, var(--hub-elevated, #0f172a) 88%, transparent)",
  };

  const fullstackTags: Tag[] = [
    {
      label: "Node.js",
      count: stats.nodejsQaBank,
      href: "/hub/candidate/nodejs-interview",
      icon: "⬢",
    },
    {
      label: "JavaScript",
      count: stats.quizJs + stats.uiVanilla,
      href: "/hub/candidate/nodejs-interview",
      icon: "JS",
    },
    {
      label: "React",
      count: stats.uiReact + stats.quizReact,
      href: "/hub/candidate",
      icon: "⚛",
    },
    {
      label: "TypeScript",
      count: Math.max(1, Math.floor(stats.ui / 3)),
      href: "/hub/candidate",
      icon: "TS",
    },
    {
      label: "Vue.js",
      count: stats.uiVue,
      href: "/hub/candidate",
      icon: "V",
    },
    {
      label: "Angular",
      count: stats.uiAngular,
      href: "/hub/candidate",
      icon: "A",
    },
    {
      label: "HTML / DOM",
      count: stats.uiVanilla,
      href: "/hub/candidate",
      icon: "⟨⟩",
    },
    {
      label: "CSS",
      count: Math.max(1, stats.quiz),
      href: "/hub/candidate",
      icon: "#",
    },
    {
      label: "Quizzes",
      count: stats.quiz,
      href: "/hub/candidate",
      icon: "?",
    },
    {
      label: "UI challenges",
      count: stats.ui,
      href: "/hub/candidate",
      icon: "◫",
    },
  ];

  const algoTags: Tag[] = [
    {
      label: "All DSA",
      count: stats.dsa,
      href: "/hub/candidate",
      icon: "∑",
    },
    {
      label: "Arrays & strings",
      count: stats.topicArrays + 2,
      href: "/hub/candidate",
      icon: "[]",
    },
    {
      label: "Graphs",
      count: stats.topicGraphs,
      href: "/hub/candidate",
      icon: "◎",
    },
    {
      label: "Dynamic programming",
      count: stats.topicDp,
      href: "/hub/candidate",
      icon: "⌁",
    },
    {
      label: "Stacks & queues",
      count: 2,
      href: "/hub/candidate",
      icon: "⊔",
    },
    {
      label: "Binary search",
      count: 1,
      href: "/hub/candidate",
      icon: "⌕",
    },
  ];

  const systemTags: Tag[] = [
    {
      label: "Frontend system design",
      count: stats.fsd,
      href: "/hub/candidate",
      icon: "⬡",
    },
    {
      label: "CDN & static",
      count: Math.max(1, stats.fsd),
      href: "/hub/candidate",
      icon: "☁",
    },
    {
      label: "SSR & edge",
      count: stats.fsd,
      href: "/hub/candidate",
      icon: "⚡",
    },
  ];

  const tabs: { id: TabId; label: string; icon: string }[] = [
    { id: "fullstack", label: "Full-Stack, Web & Mobile", icon: "◇" },
    { id: "algorithms", label: "Algorithms & Data Structures", icon: "⌬" },
    { id: "system", label: "System Design & Architecture", icon: "⬢" },
  ];

  const activeTags =
    tab === "fullstack"
      ? fullstackTags
      : tab === "algorithms"
        ? algoTags
        : systemTags;

  return (
    <div
      className="hub-fs-landing -mx-4 w-[calc(100%+2rem)] max-w-none rounded-none md:-mx-8 md:w-[calc(100%+4rem)]"
      style={{
        backgroundColor: "var(--hub-page-bg, #020617)",
        color: "var(--hub-page-fg, #f1f5f9)",
      }}
    >
      {/* In-page toolbar — uses same --hub-primary* as theme picker */}
      {/* <div
        className="border-b px-4 py-3 backdrop-blur-sm md:px-6"
        style={{
          borderColor: "var(--hub-border, #1e293b)",
          backgroundColor:
            "color-mix(in srgb, var(--hub-page-bg, #020617) 85%, var(--hub-elevated))",
        }}
      >
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <Link
            href="/hub"
            className="flex items-center gap-2 font-display text-lg font-bold tracking-tight"
            style={{ color: "var(--hub-page-fg, #f8fafc)" }}
          >
            <span
              className="hub-btn-primary flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold"
              aria-hidden
            >
              TQ
            </span>
            TorqStudio Interview Hub
          </Link>
          <div className="flex flex-wrap items-center gap-3 md:gap-4">
            <label
              className="flex cursor-pointer items-center gap-2 text-sm"
              style={{ color: "var(--hub-muted, #94a3b8)" }}
            >
              <span
                className="relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors"
                style={{
                  backgroundColor: hiringMode
                    ? "var(--hub-primary, #0891b2)"
                    : "var(--hub-border, #334155)",
                }}
              >
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={hiringMode}
                  onChange={(e) => setHiringMode(e.target.checked)}
                  aria-label="I'm hiring developers"
                />
                <span className="pointer-events-none absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
              </span>
              <span className="hidden sm:inline">I&apos;m hiring devs</span>
            </label>
            <Link
              href="/hub/candidate"
              className="hub-btn-primary inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold shadow-md hover:shadow-lg"
            >
              Explore {stats.total}+ questions
            </Link>
            {data?.user ? (
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/hub" })}
                className="rounded-lg border px-3 py-2 text-sm font-medium transition-colors hover:opacity-90"
                style={{
                  borderColor: "var(--hub-border, #334155)",
                  color: "var(--hub-page-fg, #e2e8f0)",
                  backgroundColor: "transparent",
                }}
              >
                Sign out
              </button>
            ) : (
              <Link
                href="/hub/signin"
                className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium shadow-sm transition-colors hover:opacity-90"
                style={{
                  borderColor: "var(--hub-border, #334155)",
                  color: "var(--hub-page-fg, #e2e8f0)",
                  backgroundColor:
                    "color-mix(in srgb, var(--hub-elevated) 50%, transparent)",
                }}
              >
                <span className="text-base" aria-hidden>
                  G
                </span>
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div> */}

      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
        {/* Hero */}
        <div className="text-center">
          <h1
            className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl"
            style={{ color: "var(--hub-page-fg, #f8fafc)" }}
          >
            Ace Your Tech Interview
          </h1>
          <p
            className="mx-auto mt-4 max-w-3xl text-lg sm:text-xl"
            style={{ color: "var(--hub-muted, #94a3b8)" }}
          >
            <span
              className="font-semibold"
              style={{ color: "var(--hub-page-fg, #f1f5f9)" }}
            >
              {stats.total}
            </span>{" "}
            full-stack, algorithms &amp; system design{" "}
            <span className="hub-hero-highlight rounded px-1.5 py-0.5 font-semibold">
              interview questions
            </span>{" "}
            — practice in-browser, run code, and read curated theory.
          </p>
          <p
            className="mt-2 text-sm"
            style={{ color: "var(--hub-muted, #64748b)" }}
          >
            Built to help you land your next offer. Free during launch.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/hub/candidate"
              className="hub-btn-primary rounded-xl px-8 py-3.5 text-base font-bold shadow-lg transition-transform hover:scale-[1.02]"
            >
              See all questions
            </Link>
            <Link
              href="/hub/candidate/nodejs-interview"
              className="hub-text-accent text-base font-semibold underline-offset-2 hover:underline"
            >
              JavaScript &amp; Node.js Q&amp;A bank →
            </Link>
          </div>
        </div>

        {/* Hiring mode banner */}
        {hiringMode && (
          <div
            className="mx-auto mt-8 max-w-3xl rounded-xl border-2 px-4 py-3 text-center text-sm"
            style={{
              borderColor: "var(--hub-primary, #0891b2)",
              backgroundColor:
                "color-mix(in srgb, var(--hub-primary) 16%, var(--hub-elevated, #0f172a))",
              color: "var(--hub-page-fg, #e2e8f0)",
            }}
            role="status"
          >
            <strong>Hiring mode:</strong>{" "}
            <Link
              href="/hub/hiring"
              className="hub-text-accent font-semibold underline"
            >
              Generate interview sets
            </Link>
            ,{" "}
            <Link href="/hub/jobs" className="font-semibold underline">
              post jobs
            </Link>
            , and{" "}
            <Link href="/hub/talent" className="font-semibold underline">
              browse talent
            </Link>
            .
          </div>
        )}

        {/* Main hub card — tabs + tag grid */}
        <div
          className="mt-12 rounded-2xl border p-4 shadow-sm md:p-8"
          style={surface}
        >
          <div
            className="flex flex-wrap gap-1 border-b pb-0"
            style={{ borderColor: "var(--hub-border, #334155)" }}
            role="tablist"
            aria-label="Question categories"
          >
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={`relative flex items-center gap-2 rounded-t-lg px-4 py-3 text-sm font-semibold transition-colors md:text-base ${
                  tab === t.id
                    ? "after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:rounded-full after:bg-[var(--hub-primary,#0891b2)]"
                    : ""
                }`}
                style={{
                  color:
                    tab === t.id
                      ? "var(--hub-page-fg, #f8fafc)"
                      : "var(--hub-muted, #64748b)",
                }}
              >
                <span className="opacity-70" aria-hidden>
                  {t.icon}
                </span>
                <span className="hidden sm:inline">{t.label}</span>
                <span className="sm:hidden">
                  {t.id === "fullstack"
                    ? "Full-Stack"
                    : t.id === "algorithms"
                      ? "Algorithms"
                      : "System"}
                </span>
              </button>
            ))}
          </div>

          <div className="pt-8" role="tabpanel">
            <p
              className="mb-6 text-sm"
              style={{ color: "var(--hub-muted, #64748b)" }}
            >
              Pick a topic to jump into practice. Counts reflect your hub
              question bank.
            </p>
            <div className="flex flex-wrap gap-2.5 md:gap-3">
              {activeTags.map((tg) => (
                <TagPill key={tg.label} tag={tg} />
              ))}
            </div>
          </div>

          <div
            className="mt-8 rounded-xl border px-4 py-3 text-center text-sm"
            style={{
              borderColor: "var(--hub-primary, #0891b2)",
              backgroundColor:
                "color-mix(in srgb, var(--hub-primary) 12%, var(--hub-elevated, #0f172a))",
              color: "var(--hub-page-fg, #e2e8f0)",
            }}
          >
            Want theory-only prep? Open the{" "}
            <Link
              href="/hub/candidate/nodejs-interview"
              className="hub-text-accent font-semibold underline-offset-2 hover:underline"
            >
              Node.js &amp; JavaScript Q&amp;A
            </Link>{" "}
            — expandable answers, FullStack.Cafe-style.
          </div>
        </div>

        {/* Featured vertical cards */}
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "DSA labs with sandbox runs",
              tag: `Algorithms ${stats.dsa}`,
              desc: "Monaco editor, Piston execution, and instant feedback. Solve arrays, graphs, DP, and more.",
              href: "/hub/candidate",
              gradient: "from-violet-500 to-indigo-600",
            },
            {
              title: "Multi-framework UI challenges",
              tag: `UI ${stats.ui}`,
              desc: "Vanilla, React, Vue, Angular, Svelte templates with live iframe preview and structure checks.",
              href: "/hub/candidate",
              gradient: "from-cyan-500 to-blue-600",
            },
            {
              title: "Frontend system design canvas",
              tag: `System ${stats.fsd}`,
              desc: "Drag CDN, SSR, API, and cache nodes. Submit diagrams against official solution patterns.",
              href: "/hub/candidate",
              gradient: "from-cyan-600 to-indigo-700",
            },
          ].map((card) => (
            <article
              key={card.title}
              className="flex flex-col overflow-hidden rounded-2xl border shadow-sm transition-shadow hover:shadow-md"
              style={surface}
            >
              <div className="p-5 pb-0">
                <h3
                  className="font-display text-lg font-bold leading-snug"
                  style={{ color: "var(--hub-page-fg, #f8fafc)" }}
                >
                  {card.title}
                </h3>
                <span
                  className="mt-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold"
                  style={{
                    borderColor: "var(--hub-border, #334155)",
                    backgroundColor:
                      "color-mix(in srgb, var(--hub-page-bg) 80%, var(--hub-muted))",
                    color: "var(--hub-page-fg, #e2e8f0)",
                  }}
                >
                  {card.tag}
                </span>
              </div>
              <div
                className={`mx-5 my-4 h-28 rounded-xl bg-gradient-to-br ${card.gradient} shadow-inner opacity-90`}
                aria-hidden
              />
              <div className="flex flex-1 flex-col px-5 pb-5">
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--hub-muted, #94a3b8)" }}
                >
                  {card.desc}
                </p>
                <Link
                  href={card.href}
                  className="hub-text-accent mt-4 inline-flex text-sm font-bold underline-offset-2 hover:underline"
                >
                  Start practicing →
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Horizontal list style */}
        <div
          className="mt-12 rounded-2xl border p-4 shadow-sm md:p-6"
          style={surface}
        >
          <h2
            className="mb-4 font-display text-xl font-bold"
            style={{ color: "var(--hub-page-fg, #f8fafc)" }}
          >
            Popular tracks
          </h2>
          <ul role="list">
            {[
              {
                title: "JavaScript & Node.js interview Q&A (answered)",
                snippet:
                  "Hoisting, closures, event loop, streams, modules — expand each answer in place.",
                href: "/hub/candidate/nodejs-interview",
                tag: `Q&A ${stats.nodejsQaBank}`,
                swatch: "amber" as Swatch,
              },
              {
                title: "Candidate dashboard — filter full question bank",
                snippet:
                  "Topic, difficulty, company tags, and framework filters for coding, UI, and quizzes.",
                href: "/hub/candidate",
                tag: `Bank ${stats.total}`,
                swatch: "sky" as Swatch,
              },
              {
                title: "Preparation plans (1 week → 3 months)",
                snippet:
                  "Structured milestones to pace your study alongside the hub problems.",
                href: "/hub/candidate/plans",
                tag: "Plans",
                swatch: "emerald" as Swatch,
              },
              {
                title: "Community & per-question discussions",
                snippet: "Threads tied to each problem — ask and share approaches.",
                href: "/hub/community",
                tag: "Forum",
                swatch: "purple" as Swatch,
              },
            ].map((row) => (
              <li
                key={row.title}
                className="border-b last:border-b-0"
                style={{ borderColor: "var(--hub-border, #334155)" }}
              >
                <Link
                  href={row.href}
                  className="hub-fs-row flex gap-4 py-4 transition-colors md:gap-5"
                >
                  <div
                    className={`${SWATCH_CLASS[row.swatch]} flex h-16 w-24 shrink-0 items-center justify-center rounded-lg text-xs font-bold`}
                    aria-hidden
                  >
                    Hub
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3
                      className="font-semibold"
                      style={{ color: "var(--hub-page-fg, #f1f5f9)" }}
                    >
                      {row.title}
                    </h3>
                    <p
                      className="mt-1 line-clamp-2 text-sm"
                      style={{ color: "var(--hub-muted, #94a3b8)" }}
                    >
                      {row.snippet}
                    </p>
                    <span
                      className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${SWATCH_CLASS[row.swatch]}`}
                    >
                      {row.tag}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Mode cards row */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          <Link
            href="/hub/candidate"
            className="rounded-2xl border border-[var(--hub-border)] p-6 shadow-sm transition-all hover:border-[color:color-mix(in_srgb,var(--hub-primary)_48%,var(--hub-border))] hover:shadow-md"
            style={{ backgroundColor: surface.backgroundColor }}
          >
            <h3
              className="font-display text-lg font-bold"
              style={{ color: "var(--hub-page-fg, #f8fafc)" }}
            >
              I&apos;m a candidate
            </h3>
            <p
              className="mt-2 text-sm"
              style={{ color: "var(--hub-muted, #94a3b8)" }}
            >
              Practice, track progress, join talent pool, book mocks.
            </p>
          </Link>
          <Link
            href="/hub/hiring"
            className="rounded-2xl border border-[var(--hub-border)] p-6 shadow-sm transition-all hover:border-[color:color-mix(in_srgb,var(--hub-primary)_48%,var(--hub-border))] hover:shadow-md"
            style={{ backgroundColor: surface.backgroundColor }}
          >
            <h3
              className="font-display text-lg font-bold"
              style={{ color: "var(--hub-page-fg, #f8fafc)" }}
            >
              I&apos;m hiring
            </h3>
            <p
              className="mt-2 text-sm"
              style={{ color: "var(--hub-muted, #94a3b8)" }}
            >
              Generate sets, export PDF, post jobs, browse candidates.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { DevToolsToolCard } from "@/components/umbrella-tools/DevToolsToolCard";
import { useDevToolsLocale } from "@/components/umbrella-tools/DevToolsLocaleProvider";
import { getDevToolsHrefForLocale } from "@/lib/dev-tools-locale-path";
import type { DevToolsAdminDocument } from "@/lib/content";
import { isDevToolFeatured } from "@/lib/dev-tools-admin";
import type { DevToolCategory, UmbrellaTool } from "@/lib/umbrella-tools/types";

type Section = {
  category: DevToolCategory;
  tools: UmbrellaTool[];
};

export function DevToolsHubBody({
  sections,
  toolCount,
  adminDoc,
}: {
  sections: Section[];
  toolCount: number;
  adminDoc: DevToolsAdminDocument | null;
}) {
  const { messages, locale } = useDevToolsLocale();

  return (
    <>
      <section className="relative overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-b from-surface-elevated/70 via-surface/40 to-background px-4 py-7 shadow-[0_28px_90px_-40px_rgb(0_0_0/0.55),inset_0_1px_0_0_rgb(255_255_255/0.05)] ring-1 ring-inset ring-white/[0.05] sm:px-8 sm:py-9 lg:px-10 dark:from-surface-elevated/50">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_-30%,var(--app-primary-muted),transparent_55%)] opacity-100"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[radial-gradient(circle,var(--app-accent-muted),transparent_70%)] opacity-80 blur-2xl"
          aria-hidden
        />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary shadow-sm ring-1 ring-inset ring-primary/15 sm:text-xs">
            {messages.hub.badge}
          </p>
          <h1 className="mt-4 font-display text-2xl font-bold leading-[1.12] tracking-tight text-foreground drop-shadow-[0_2px_24px_rgb(245_158_11/0.12)] sm:text-3xl lg:text-[2.35rem]">
            {messages.hub.title}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {messages.hub.description1}
          </p>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {messages.hub.description2}
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-xs leading-relaxed text-muted-foreground/90 sm:text-sm">
            {messages.hub.description3}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground sm:gap-3 sm:text-sm">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/45 bg-surface-elevated/60 px-3 py-1.5 shadow-sm ring-1 ring-inset ring-white/[0.04] backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-success shadow-[0_0_10px_rgb(52_211_153/0.45)]" aria-hidden />
              {messages.hub.toolsAvailable(toolCount)}
            </span>
            <Link
              href={getDevToolsHrefForLocale("/dev-tools/about", locale)}
              className="inline-flex items-center rounded-full border border-border/45 bg-surface-elevated/50 px-3 py-1.5 font-medium text-foreground shadow-sm ring-1 ring-inset ring-white/[0.04] transition-all hover:border-primary/35 hover:text-primary hover:shadow-[0_0_24px_-8px_rgb(245_158_11/0.4)]"
            >
              {messages.hub.howData}
            </Link>
          </div>
        </div>
      </section>

      <div className="mt-10 space-y-10 lg:mt-12 lg:space-y-12">
        {sections.map(({ category, tools }) => (
          <section key={category} aria-labelledby={`dev-tools-cat-${category}`}>
            <div className="mb-4 flex flex-col gap-1.5 border-b border-border/30 pb-3 sm:flex-row sm:items-end sm:justify-between">
              <h2
                id={`dev-tools-cat-${category}`}
                className="font-display text-lg font-semibold tracking-tight text-foreground sm:text-xl"
              >
                {messages.categoryLabels[category]}
              </h2>
              <p className="max-w-md text-xs text-muted-foreground sm:text-sm">{messages.categoryBlurbs[category]}</p>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5">
              {tools.map((tool) => (
                <li key={tool.slug}>
                  <DevToolsToolCard tool={tool} featured={isDevToolFeatured(tool.slug, adminDoc)} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <aside className="mt-12 rounded-2xl border border-dashed border-border/50 bg-gradient-to-br from-surface/50 to-surface-elevated/30 p-5 text-center shadow-inner ring-1 ring-inset ring-white/[0.03] sm:p-6 lg:mt-14">
        <p className="font-display text-base font-semibold text-foreground sm:text-lg">{messages.hub.expandingTitle}</p>
        <p className="mx-auto mt-2 max-w-lg text-xs leading-relaxed text-muted-foreground sm:text-sm">
          {messages.hub.expandingBodyPrefix}{" "}
          <Link href="/contact" className="font-medium text-primary underline-offset-2 hover:underline">
            {messages.hub.contactLink}
          </Link>
          {messages.hub.expandingBodySuffix}
        </p>
      </aside>
    </>
  );
}

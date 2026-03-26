"use client";

import Link from "next/link";
import { DevToolsToolCard } from "@/components/umbrella-tools/DevToolsToolCard";
import { useDevToolsLocale } from "@/components/umbrella-tools/DevToolsLocaleProvider";
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
  const { messages } = useDevToolsLocale();

  return (
    <>
      <section className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-b from-surface/50 via-background to-background px-6 py-10 sm:px-10 sm:py-12 lg:px-12">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_50%_-25%,var(--app-primary-muted),transparent)] opacity-90"
          aria-hidden
        />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{messages.hub.badge}</p>
          <h1 className="mt-4 font-display text-3xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-4xl lg:text-[2.65rem]">
            {messages.hub.title}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {messages.hub.description1}
          </p>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {messages.hub.description2}
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground/90">
            {messages.hub.description3}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-surface/50 px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-success" aria-hidden />
              {messages.hub.toolsAvailable(toolCount)}
            </span>
            <Link
              href="/dev-tools/about"
              className="inline-flex items-center rounded-full border border-border/60 bg-surface/50 px-4 py-2 font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              {messages.hub.howData}
            </Link>
          </div>
        </div>
      </section>

      <div className="mt-14 space-y-14 lg:mt-16 lg:space-y-16">
        {sections.map(({ category, tools }) => (
          <section key={category} aria-labelledby={`dev-tools-cat-${category}`}>
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <h2
                id={`dev-tools-cat-${category}`}
                className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl"
              >
                {messages.categoryLabels[category]}
              </h2>
              <p className="max-w-md text-sm text-muted-foreground">{messages.categoryBlurbs[category]}</p>
            </div>
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {tools.map((tool) => (
                <li key={tool.slug}>
                  <DevToolsToolCard tool={tool} featured={isDevToolFeatured(tool.slug, adminDoc)} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <aside className="mt-16 rounded-2xl border border-dashed border-border/70 bg-surface/30 p-8 text-center lg:mt-20">
        <p className="font-display text-lg font-semibold text-foreground">{messages.hub.expandingTitle}</p>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
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

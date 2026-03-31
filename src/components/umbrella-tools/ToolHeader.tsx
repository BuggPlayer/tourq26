"use client";

import Link from "next/link";
import { useDevToolsLocale } from "@/components/umbrella-tools/DevToolsLocaleProvider";
import { getDevToolsHrefForLocale } from "@/lib/dev-tools-locale-path";
import { DEV_TOOL_CATEGORY_LABELS } from "@/lib/umbrella-tools/tools-config";
import type { DevToolCategory } from "@/lib/umbrella-tools/tools-config";

export type ToolHeaderSegment = "full" | "lead" | "trail";

type Props = {
  title: string;
  description: string;
  category?: DevToolCategory;
  /** Plain text; use `\\n\\n` between paragraphs. Renders visible copy for users & search. */
  seoIntro?: string;
  /**
   * `full` — back link, title, description, intro (default).
   * `lead` — back link, category, title only (for placing the tool UI directly under the name).
   * `trail` — description and intro only (rendered below the primary tool block).
   */
  segment?: ToolHeaderSegment;
};

export default function ToolHeader({
  title,
  description,
  category,
  seoIntro,
  segment = "full",
}: Props) {
  const { messages, locale } = useDevToolsLocale();
  const introParagraphs = seoIntro?.trim()
    ? seoIntro
        .split(/\n\n+/)
        .map((p) => p.trim())
        .filter(Boolean)
    : [];

  const backLink = (
    <Link
      href={getDevToolsHrefForLocale("/dev-tools", locale)}
      className="inline-flex items-center gap-1.5 rounded-lg px-1 -mx-1 py-0.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-elevated/80 hover:text-primary"
    >
      <span aria-hidden>←</span> {messages.toolHeader.backToTools}
    </Link>
  );

  const categoryLine =
    category ? (
      <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary/90">
        {messages.categoryLabels[category] ?? DEV_TOOL_CATEGORY_LABELS[category]}
      </p>
    ) : null;

  const titleBlock = (
    <h1
      className={`break-words text-balance font-display text-xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-[2rem] lg:leading-[1.15] ${category ? "mt-1.5" : "mt-3"}`}
    >
      {title}
    </h1>
  );

  const introBlock =
    introParagraphs.length > 0 ? (
      <div
        className="mt-4 max-w-2xl space-y-2 border-l-2 border-primary/30 pl-3 text-sm leading-relaxed text-muted-foreground"
        role="region"
        aria-label={messages.toolHeader.aboutRegion}
      >
        {introParagraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    ) : null;

  if (segment === "lead") {
    return (
      <header className="mb-2 sm:mb-3">
        {backLink}
        {categoryLine}
        {titleBlock}
      </header>
    );
  }

  if (segment === "trail") {
    return (
      <div className="mt-8 min-w-0 border-t border-border/40 pt-6 sm:mt-10 sm:pt-8">
        <p className="max-w-2xl break-words text-sm leading-relaxed text-muted-foreground sm:text-base">{description}</p>
        {introBlock}
      </div>
    );
  }

  return (
    <header className="mb-6 border-b border-border/40 pb-6">
      {backLink}
      {categoryLine}
      {titleBlock}
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">{description}</p>
      {introBlock}
    </header>
  );
}

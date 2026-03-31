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
      className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
    >
      <span aria-hidden>←</span> {messages.toolHeader.backToTools}
    </Link>
  );

  const categoryLine =
    category ? (
      <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary/90">
        {messages.categoryLabels[category] ?? DEV_TOOL_CATEGORY_LABELS[category]}
      </p>
    ) : null;

  const titleBlock = (
    <h1
      className={`break-words text-balance font-display text-2xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-[2.5rem] lg:leading-tight ${category ? "mt-2" : "mt-5"}`}
    >
      {title}
    </h1>
  );

  const introBlock =
    introParagraphs.length > 0 ? (
      <div
        className="mt-6 max-w-2xl space-y-3 border-l-2 border-primary/30 pl-4 text-sm leading-relaxed text-muted-foreground sm:text-[0.95rem]"
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
      <header className="mb-3 sm:mb-4">
        {backLink}
        {categoryLine}
        {titleBlock}
      </header>
    );
  }

  if (segment === "trail") {
    return (
      <div className="mt-10 min-w-0 border-t border-border/40 pt-8 sm:mt-12 sm:pt-10">
        <p className="max-w-2xl break-words text-base leading-relaxed text-muted-foreground sm:text-lg">{description}</p>
        {introBlock}
      </div>
    );
  }

  return (
    <header className="mb-8 border-b border-border/40 pb-8">
      {backLink}
      {categoryLine}
      {titleBlock}
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">{description}</p>
      {introBlock}
    </header>
  );
}

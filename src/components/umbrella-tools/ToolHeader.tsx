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
  /** Shown in the H1 after an em dash (what the tool does). */
  functionPart?: string;
  /** 40–70 word intro above the tool (`lead` / `full`); falls back to `description` in `full` when omitted. */
  introBlurb?: string;
  /** Plain text; use `\\n\\n` between paragraphs. Renders below Features / How to / Benefits (or after long-form tool UI). */
  seoIntro?: string;
  /**
   * `full` — back link, title, lead copy, then optional long intro after editorial (via separate `trail` pass).
   * `lead` — back link, category, H1 + function, intro blurb.
   * `trail` — long `seoIntro` only (below editorial sections).
   */
  segment?: ToolHeaderSegment;
};

export default function ToolHeader({
  title,
  description,
  category,
  functionPart,
  introBlurb,
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
      {functionPart?.trim() ? (
        <>
          {" "}
          <span className="text-muted-foreground">— {functionPart.trim()}</span>
        </>
      ) : null}
    </h1>
  );

  const introBlurbBlock =
    introBlurb?.trim() && (segment === "lead" || segment === "full") ? (
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">{introBlurb.trim()}</p>
    ) : null;

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
        {introBlurbBlock}
      </header>
    );
  }

  if (segment === "trail") {
    if (!seoIntro?.trim()) return null;
    return (
      <div className="mt-8 min-w-0 border-t border-border/40 pt-6 sm:mt-10 sm:pt-8">
        {introBlock}
      </div>
    );
  }

  const fullLead = introBlurb?.trim() || description;

  return (
    <header className="mb-6 border-b border-border/40 pb-6">
      {backLink}
      {categoryLine}
      {titleBlock}
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">{fullLead}</p>
    </header>
  );
}

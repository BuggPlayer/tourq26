"use client";

import Link from "next/link";
import { useDevToolsLocale } from "@/components/umbrella-tools/DevToolsLocaleProvider";
import { getDevToolsHrefForLocale } from "@/lib/dev-tools-locale-path";
import type { UmbrellaTool } from "@/lib/umbrella-tools/tools-config";
import { DEV_TOOL_CATEGORY_LABELS } from "@/lib/umbrella-tools/tools-config";

type Props = {
  tool: UmbrellaTool;
  /** Admin-managed hub highlight (badge + sort); independent of optional registry `tool.badge`. */
  featured?: boolean;
};

export function DevToolsToolCard({ tool, featured }: Props) {
  const { messages, locale } = useDevToolsLocale();
  const categoryLabel = messages.categoryLabels[tool.category] ?? DEV_TOOL_CATEGORY_LABELS[tool.category];

  return (
    <Link
      href={getDevToolsHrefForLocale(`/dev-tools/${tool.slug}`, locale)}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/45 bg-gradient-to-br from-surface-elevated via-surface-elevated/95 to-surface/90 p-4 shadow-[0_1px_0_0_rgb(255_255_255/0.06)_inset,0_8px_32px_-16px_rgb(0_0_0/0.45)] ring-1 ring-inset ring-white/[0.04] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_1px_0_0_rgb(255_255_255/0.08)_inset,0_16px_48px_-20px_rgb(0_0_0/0.55),0_0_0_1px_rgb(245_158_11/0.08)] sm:p-4"
    >
      {featured ? (
        <span className="absolute left-3 top-3 rounded-full border border-amber-500/40 bg-amber-500/[0.12] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-700 shadow-sm backdrop-blur-sm dark:text-amber-400">
          {messages.toolCard.featured}
        </span>
      ) : null}
      {tool.badge ? (
        <span className="absolute right-3 top-3 rounded-full border border-primary/20 bg-primary/12 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary shadow-sm backdrop-blur-sm">
          {tool.badge}
        </span>
      ) : null}
      <div className="flex items-start gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-gradient-to-br from-primary/15 to-primary/5 text-lg text-primary shadow-inner ring-1 ring-inset ring-white/[0.06] transition-all duration-300 group-hover:border-primary/40 group-hover:from-primary/20 group-hover:to-primary/8"
          aria-hidden
        >
          <span className="font-mono">{tool.icon}</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{categoryLabel}</p>
          <h3 className="mt-0.5 font-display text-base font-bold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-lg">
            {tool.title}
          </h3>
        </div>
      </div>
      <p className="mt-3 flex-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">{tool.description}</p>
      <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-primary sm:text-sm">
        {messages.toolCard.openTool}
        <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
          →
        </span>
      </span>
    </Link>
  );
}

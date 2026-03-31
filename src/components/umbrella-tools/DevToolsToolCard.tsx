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
      className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border/70 bg-surface-elevated/90 p-5 shadow-[0_1px_0_0_rgb(255_255_255/0.04)_inset] transition-all duration-200 hover:border-primary/30 hover:shadow-md sm:p-6"
    >
      {featured ? (
        <span className="absolute left-4 top-4 rounded-full border border-amber-500/35 bg-amber-500/12 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
          {messages.toolCard.featured}
        </span>
      ) : null}
      {tool.badge ? (
        <span className="absolute right-4 top-4 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
          {tool.badge}
        </span>
      ) : null}
      <div className="flex items-start gap-4">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-xl text-primary transition-colors group-hover:border-primary/35 group-hover:bg-primary/15"
          aria-hidden
        >
          <span className="font-mono">{tool.icon}</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{categoryLabel}</p>
          <h3 className="mt-1 font-display text-lg font-bold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-xl">
            {tool.title}
          </h3>
        </div>
      </div>
      <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">{tool.description}</p>
      <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
        {messages.toolCard.openTool}
        <span className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden>
          →
        </span>
      </span>
    </Link>
  );
}

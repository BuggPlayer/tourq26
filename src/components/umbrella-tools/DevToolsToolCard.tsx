import Link from "next/link";
import type { UmbrellaTool } from "@/lib/umbrella-tools/tools-config";
import { DEV_TOOL_CATEGORY_LABELS } from "@/lib/umbrella-tools/tools-config";

type Props = {
  tool: UmbrellaTool;
};

export function DevToolsToolCard({ tool }: Props) {
  const categoryLabel = DEV_TOOL_CATEGORY_LABELS[tool.category];

  return (
    <Link
      href={`/dev-tools/${tool.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-b from-surface-elevated/80 to-surface/40 p-6 shadow-sm transition-all duration-200 hover:border-primary/35 hover:shadow-[var(--shadow-card)] sm:p-7"
    >
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
          <h2 className="mt-1 font-display text-lg font-bold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-xl">
            {tool.title}
          </h2>
        </div>
      </div>
      <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">{tool.description}</p>
      <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
        Open tool
        <span className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden>
          →
        </span>
      </span>
    </Link>
  );
}

"use client";

import { useMemo, useState } from "react";
import { DevToolsMobileNav } from "@/components/umbrella-tools/DevToolsMobileNav";
import { useDevToolsLocale } from "@/components/umbrella-tools/DevToolsLocaleProvider";
import {
  DEV_TOOL_CATEGORY_LABELS,
  filterUmbrellaTools,
  UMBRELLA_TOOLS,
  type UmbrellaTool,
} from "@/lib/umbrella-tools/tools-config";

export function DevToolsMobileSection({ baseTools = UMBRELLA_TOOLS }: { baseTools?: UmbrellaTool[] }) {
  const [q, setQ] = useState("");
  const { messages } = useDevToolsLocale();
  const filtered = useMemo(
    () =>
      filterUmbrellaTools(q, baseTools, (c) => messages.categoryLabels[c] ?? DEV_TOOL_CATEGORY_LABELS[c]),
    [q, baseTools, messages.categoryLabels],
  );

  return (
    <div className="border-b border-border/40 bg-surface/30 shadow-[inset_0_1px_0_0_rgb(255_255_255/0.04)] backdrop-blur-md supports-[backdrop-filter]:bg-surface/20 lg:hidden">
      <div className="border-b border-border/40 px-[max(0.75rem,env(safe-area-inset-left,0px))] pe-[max(0.75rem,env(safe-area-inset-right,0px))] py-2">
        <label htmlFor="dev-tools-search-mobile" className="sr-only">
          {messages.mobile.searchLabel}
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden>
            ⌕
          </span>
          <input
            id="dev-tools-search-mobile"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={messages.mobile.searchPlaceholder}
            className="min-h-10 w-full rounded-lg border border-border/60 bg-background py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
            autoComplete="off"
          />
        </div>
      </div>
      <details className="group">
        <summary className="flex min-h-11 cursor-pointer list-none touch-manipulation items-center px-[max(0.75rem,env(safe-area-inset-left,0px))] pe-[max(0.75rem,env(safe-area-inset-right,0px))] py-2.5 text-xs font-semibold text-foreground [-webkit-tap-highlight-color:transparent] [&::-webkit-details-marker]:hidden sm:text-sm">
          <span className="flex items-center justify-between gap-2">
            {messages.mobile.browseTools}
            <span className="text-muted-foreground transition-transform group-open:rotate-180">▼</span>
          </span>
        </summary>
        <div className="max-h-[min(55dvh,480px)] overflow-y-auto overscroll-y-contain border-t border-border/40 [-webkit-overflow-scrolling:touch]">
          <DevToolsMobileNav tools={filtered} query={q} />
        </div>
      </details>
    </div>
  );
}

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
    <div className="border-b border-border/50 bg-surface/30 lg:hidden">
      <div className="border-b border-border/40 px-[max(1rem,env(safe-area-inset-left,0px))] pe-[max(1rem,env(safe-area-inset-right,0px))] py-3">
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
            className="min-h-11 w-full rounded-lg border border-border/60 bg-background py-2.5 pl-9 pr-3 text-base text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm"
            autoComplete="off"
          />
        </div>
      </div>
      <details className="group">
        <summary className="flex min-h-12 cursor-pointer list-none touch-manipulation items-center px-[max(1rem,env(safe-area-inset-left,0px))] pe-[max(1rem,env(safe-area-inset-right,0px))] py-3 text-sm font-semibold text-foreground [-webkit-tap-highlight-color:transparent] [&::-webkit-details-marker]:hidden">
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

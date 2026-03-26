"use client";

import { useMemo, useState } from "react";
import { DevToolsMobileNav } from "@/components/umbrella-tools/DevToolsMobileNav";
import { filterUmbrellaTools, UMBRELLA_TOOLS, type UmbrellaTool } from "@/lib/umbrella-tools/tools-config";

export function DevToolsMobileSection({ baseTools = UMBRELLA_TOOLS }: { baseTools?: UmbrellaTool[] }) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => filterUmbrellaTools(q, baseTools), [q, baseTools]);

  return (
    <div className="border-b border-border/50 bg-surface/30 lg:hidden">
      <div className="border-b border-border/40 px-4 py-3">
        <label htmlFor="dev-tools-search-mobile" className="sr-only">
          Search tools
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
            placeholder="Search tools…"
            className="w-full rounded-lg border border-border/60 bg-background py-2.5 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            autoComplete="off"
          />
        </div>
      </div>
      <details className="group">
        <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-foreground [&::-webkit-details-marker]:hidden">
          <span className="flex items-center justify-between gap-2">
            Browse tools
            <span className="text-muted-foreground transition-transform group-open:rotate-180">▼</span>
          </span>
        </summary>
        <div className="max-h-[min(55vh,480px)] overflow-y-auto border-t border-border/40">
          <DevToolsMobileNav tools={filtered} query={q} />
        </div>
      </details>
    </div>
  );
}

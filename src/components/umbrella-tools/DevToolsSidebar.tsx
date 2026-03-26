"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DEV_TOOL_CATEGORY_LABELS,
  DEV_TOOL_CATEGORY_ORDER,
  UMBRELLA_TOOLS,
  type UmbrellaTool,
} from "@/lib/umbrella-tools/tools-config";

function groupFilteredTools(tools: UmbrellaTool[]) {
  const order = DEV_TOOL_CATEGORY_ORDER;
  const map = new Map<string, UmbrellaTool[]>();
  for (const c of order) map.set(c, []);
  for (const t of tools) {
    map.get(t.category)?.push(t);
  }
  return order.map((cat) => ({ category: cat, tools: map.get(cat) ?? [] })).filter((g) => g.tools.length > 0);
}

export function DevToolsSidebar() {
  const [q, setQ] = useState("");
  const pathname = usePathname();

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return UMBRELLA_TOOLS;
    return UMBRELLA_TOOLS.filter(
      (t) =>
        t.title.toLowerCase().includes(s) ||
        t.description.toLowerCase().includes(s) ||
        t.slug.includes(s) ||
        DEV_TOOL_CATEGORY_LABELS[t.category].toLowerCase().includes(s),
    );
  }, [q]);

  const groups = useMemo(() => groupFilteredTools(filtered), [filtered]);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border/50 p-3">
        <label htmlFor="dev-tools-search" className="sr-only">
          Search tools
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden>
            ⌕
          </span>
          <input
            id="dev-tools-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search tools…"
            className="w-full rounded-lg border border-border/60 bg-background py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto p-3 pb-8" aria-label="Tools by category">
        <Link
          href="/dev-tools"
          className={`mb-4 block rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
            pathname === "/dev-tools"
              ? "bg-primary/15 text-primary"
              : "text-muted-foreground hover:bg-surface-elevated hover:text-foreground"
          }`}
        >
          All tools overview
        </Link>
        <Link
          href="/dev-tools/about"
          className={`mb-6 block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            pathname === "/dev-tools/about"
              ? "bg-primary/15 text-primary"
              : "text-muted-foreground hover:bg-surface-elevated hover:text-foreground"
          }`}
        >
          About utilities
        </Link>

        {groups.map(({ category, tools }) => (
          <div key={category} className="mb-6 last:mb-0">
            <p className="px-2 pb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              {DEV_TOOL_CATEGORY_LABELS[category]}
            </p>
            <ul className="space-y-0.5">
              {tools.map((tool) => {
                const href = `/dev-tools/${tool.slug}`;
                const active = pathname === href;
                return (
                  <li key={tool.slug}>
                    <Link
                      href={href}
                      className={`flex items-start gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors ${
                        active
                          ? "bg-primary/12 font-medium text-primary"
                          : "text-foreground/90 hover:bg-surface-elevated"
                      }`}
                    >
                      <span className="mt-0.5 font-mono text-xs text-primary/80" aria-hidden>
                        {tool.icon}
                      </span>
                      <span className="leading-snug">{tool.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        {filtered.length === 0 ? (
          <p className="px-2 text-sm text-muted-foreground">No tools match &ldquo;{q}&rdquo;.</p>
        ) : null}
      </nav>
    </div>
  );
}

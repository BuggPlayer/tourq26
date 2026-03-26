"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import {
  DEV_TOOL_CATEGORY_LABELS,
  groupToolsByCategoryOrder,
  type UmbrellaTool,
} from "@/lib/umbrella-tools/tools-config";

type Props = {
  tools: UmbrellaTool[];
  /** Current search string (for empty state copy). */
  query: string;
};

export function DevToolsMobileNav({ tools, query }: Props) {
  const pathname = usePathname();

  const groups = useMemo(() => groupToolsByCategoryOrder(tools), [tools]);

  return (
    <nav className="px-2 pb-4 pt-1" aria-label="Tools (mobile)">
      {groups.map(({ category, tools: catTools }) => (
        <div key={category} className="mb-4 last:mb-0">
          <p className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            {DEV_TOOL_CATEGORY_LABELS[category]}
          </p>
          <ul className="space-y-0.5">
            {catTools.map((tool) => {
              const href = `/dev-tools/${tool.slug}`;
              const active = pathname === href;
              return (
                <li key={tool.slug}>
                  <Link
                    href={href}
                    scroll={false}
                    className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm ${
                      active ? "bg-primary/12 font-medium text-primary" : "text-foreground hover:bg-surface-elevated"
                    }`}
                  >
                    <span className="font-mono text-xs text-primary/80">{tool.icon}</span>
                    {tool.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      {tools.length === 0 ? (
        <p className="px-2 py-3 text-sm text-muted-foreground">
          No tools match {query.trim() ? `“${query.trim()}”.` : "that search."}
        </p>
      ) : null}
    </nav>
  );
}

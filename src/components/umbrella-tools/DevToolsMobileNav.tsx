"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { useDevToolsLocale } from "@/components/umbrella-tools/DevToolsLocaleProvider";
import { getDevToolsCanonicalSuffix, getDevToolsHrefForLocale } from "@/lib/dev-tools-locale-path";
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
  const { messages, locale } = useDevToolsLocale();
  const pathSuffix = getDevToolsCanonicalSuffix(pathname);

  const groups = useMemo(() => groupToolsByCategoryOrder(tools), [tools]);

  return (
    <nav
      className="px-[max(0.5rem,env(safe-area-inset-left,0px))] pe-[max(0.5rem,env(safe-area-inset-right,0px))] pb-4 pt-1"
      aria-label={messages.mobileNav.aria}
    >
      {groups.map(({ category, tools: catTools }) => (
        <div key={category} className="mb-4 last:mb-0">
          <p className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            {messages.categoryLabels[category] ?? DEV_TOOL_CATEGORY_LABELS[category]}
          </p>
          <ul className="space-y-0.5">
            {catTools.map((tool) => {
              const href = getDevToolsHrefForLocale(`/dev-tools/${tool.slug}`, locale);
              const active = pathSuffix === `/dev-tools/${tool.slug}`;
              return (
                <li key={tool.slug}>
                  <Link
                    href={href}
                    scroll={false}
                    className={`flex min-h-11 items-center gap-2 rounded-lg px-3 py-2 text-sm ${
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
          {messages.mobileNav.noMatch(query)}
        </p>
      ) : null}
    </nav>
  );
}

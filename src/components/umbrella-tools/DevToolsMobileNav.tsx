"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DEV_TOOL_CATEGORY_LABELS,
  DEV_TOOL_CATEGORY_ORDER,
  UMBRELLA_TOOLS,
} from "@/lib/umbrella-tools/tools-config";

export function DevToolsMobileNav() {
  const pathname = usePathname();

  const groups = DEV_TOOL_CATEGORY_ORDER.map((cat) => ({
    category: cat,
    tools: UMBRELLA_TOOLS.filter((t) => t.category === cat),
  })).filter((g) => g.tools.length > 0);

  return (
    <nav className="px-2 pb-4 pt-1" aria-label="Tools (mobile)">
      {groups.map(({ category, tools }) => (
        <div key={category} className="mb-4 last:mb-0">
          <p className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
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
    </nav>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DEV_TOOL_CATEGORY_LABELS, getRelatedDevTools } from "@/lib/umbrella-tools/tools-config";

export function DevToolsRelatedTools() {
  const pathname = usePathname();
  const segments = pathname.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
  if (segments.length !== 2 || segments[0] !== "dev-tools" || segments[1] === "about") {
    return null;
  }
  const slug = segments[1]!;
  const related = getRelatedDevTools(slug, 6);
  if (related.length === 0) return null;

  return (
    <section className="mt-14 border-t border-border/50 pt-10" aria-labelledby="dev-tools-related-heading">
      <h2 id="dev-tools-related-heading" className="font-display text-lg font-semibold tracking-tight text-foreground">
        Related tools
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">Same category first, then other utilities.</p>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {related.map((t) => (
          <li key={t.slug}>
            <Link
              href={`/dev-tools/${t.slug}`}
              className="flex gap-3 rounded-xl border border-border/60 bg-surface/40 px-4 py-3 transition-colors hover:border-primary/35 hover:bg-surface-elevated/80"
            >
              <span className="font-mono text-sm text-primary/80" aria-hidden>
                {t.icon}
              </span>
              <span className="min-w-0">
                <span className="block font-medium text-foreground">{t.title}</span>
                <span className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{t.description}</span>
                <span className="mt-1 block text-[10px] font-semibold uppercase tracking-wider text-primary/70">
                  {DEV_TOOL_CATEGORY_LABELS[t.category]}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

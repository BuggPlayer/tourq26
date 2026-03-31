"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDevToolsLocale } from "@/components/umbrella-tools/DevToolsLocaleProvider";
import { getDevToolsCanonicalSuffix, getDevToolsHrefForLocale } from "@/lib/dev-tools-locale-path";
import {
  DEV_TOOL_CATEGORY_LABELS,
  getRelatedDevTools,
  type UmbrellaTool,
} from "@/lib/umbrella-tools/tools-config";

type Props = {
  /** From server when admin has disabled tools — omits hidden slugs from suggestions. */
  relatedToolsOverride?: UmbrellaTool[];
};

export function DevToolsRelatedTools({ relatedToolsOverride }: Props) {
  const pathname = usePathname();
  const { messages, locale } = useDevToolsLocale();
  const suffix = getDevToolsCanonicalSuffix(pathname);
  const parts = suffix.split("/").filter(Boolean);
  if (parts.length !== 2 || parts[0] !== "dev-tools" || parts[1] === "about") {
    return null;
  }
  const slug = parts[1]!;
  const related = relatedToolsOverride ?? getRelatedDevTools(slug, 6);
  if (related.length === 0) return null;

  return (
    <section className="mt-10 border-t border-border/50 pt-7 sm:mt-12 sm:pt-8" aria-labelledby="dev-tools-related-heading">
      <h2 id="dev-tools-related-heading" className="font-display text-base font-semibold tracking-tight text-foreground sm:text-lg">
        {messages.related.title}
      </h2>
      <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{messages.related.subtitle}</p>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2 sm:gap-3">
        {related.map((t) => (
          <li key={t.slug}>
            <Link
              href={getDevToolsHrefForLocale(`/dev-tools/${t.slug}`, locale)}
              scroll={false}
              className="flex gap-2 rounded-lg border border-border/60 bg-surface/40 px-3 py-2.5 transition-colors hover:border-primary/35 hover:bg-surface-elevated/80"
            >
              <span className="font-mono text-sm text-primary/80" aria-hidden>
                {t.icon}
              </span>
              <span className="min-w-0">
                <span className="block font-medium text-foreground">{t.title}</span>
                <span className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{t.description}</span>
                <span className="mt-1 block text-[10px] font-semibold uppercase tracking-wider text-primary/70">
                  {messages.categoryLabels[t.category] ?? DEV_TOOL_CATEGORY_LABELS[t.category]}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

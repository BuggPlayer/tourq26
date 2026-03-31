"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDevToolsLocale } from "@/components/umbrella-tools/DevToolsLocaleProvider";
import {
  getDevToolsCanonicalSuffix,
  getDevToolsHrefForLocale,
  isDevToolsPathname,
} from "@/lib/dev-tools-locale-path";
import { getDevToolBySlug } from "@/lib/umbrella-tools/tools-config";

export function DevToolsBreadcrumbs() {
  const pathname = usePathname();
  const { messages, locale } = useDevToolsLocale();
  if (!isDevToolsPathname(pathname)) return null;

  const suffix = getDevToolsCanonicalSuffix(pathname);
  const segs = suffix.replace(/^\//, "").split("/").filter(Boolean);
  const crumbs: { href: string; label: string }[] = [{ href: "/", label: messages.breadcrumbs.home }];

  if (segs.length === 1) {
    crumbs.push({ href: getDevToolsHrefForLocale("/dev-tools", locale), label: messages.breadcrumbs.devTools });
  } else if (segs[1] === "about") {
    crumbs.push({ href: getDevToolsHrefForLocale("/dev-tools", locale), label: messages.breadcrumbs.devTools });
    crumbs.push({
      href: getDevToolsHrefForLocale("/dev-tools/about", locale),
      label: messages.breadcrumbs.about,
    });
  } else if (segs[1]) {
    const slug = segs[1];
    const tool = getDevToolBySlug(slug);
    crumbs.push({ href: getDevToolsHrefForLocale("/dev-tools", locale), label: messages.breadcrumbs.devTools });
    crumbs.push({
      href: getDevToolsHrefForLocale(`/dev-tools/${slug}`, locale),
      label: tool?.title ?? slug,
    });
  }

  return (
    <nav aria-label={messages.breadcrumbs.aria} className="mb-6 min-w-0 text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {crumbs.map((c, i) => (
          <li key={`${c.href}-${i}`} className="flex min-w-0 max-w-full items-center gap-2">
            {i > 0 ? <span className="shrink-0 text-muted-foreground/40">/</span> : null}
            {i === crumbs.length - 1 ? (
              <span className="min-w-0 break-words font-medium text-foreground">{c.label}</span>
            ) : (
              <Link href={c.href} className="shrink-0 transition-colors hover:text-primary">
                {c.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

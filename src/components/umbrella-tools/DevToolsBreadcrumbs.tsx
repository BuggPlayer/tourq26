"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDevToolsLocale } from "@/components/umbrella-tools/DevToolsLocaleProvider";
import { getDevToolBySlug } from "@/lib/umbrella-tools/tools-config";

export function DevToolsBreadcrumbs() {
  const pathname = usePathname();
  const { messages } = useDevToolsLocale();
  if (!pathname.startsWith("/dev-tools")) return null;

  const segments = pathname.replace(/^\//, "").split("/").filter(Boolean);
  const crumbs: { href: string; label: string }[] = [{ href: "/", label: messages.breadcrumbs.home }];

  if (segments.length === 1 && segments[0] === "dev-tools") {
    crumbs.push({ href: "/dev-tools", label: messages.breadcrumbs.devTools });
  } else {
    crumbs.push({ href: "/dev-tools", label: messages.breadcrumbs.devTools });
    const rest = segments.slice(1);
    if (rest[0] === "about") {
      crumbs.push({ href: "/dev-tools/about", label: messages.breadcrumbs.about });
    } else if (rest[0]) {
      const tool = getDevToolBySlug(rest[0]);
      crumbs.push({ href: pathname, label: tool?.title ?? rest[0] });
    }
  }

  return (
    <nav aria-label={messages.breadcrumbs.aria} className="mb-6 text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-2">
        {crumbs.map((c, i) => (
          <li key={`${c.href}-${i}`} className="flex items-center gap-2">
            {i > 0 ? <span className="text-muted-foreground/40">/</span> : null}
            {i === crumbs.length - 1 ? (
              <span className="font-medium text-foreground">{c.label}</span>
            ) : (
              <Link href={c.href} className="transition-colors hover:text-primary">
                {c.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

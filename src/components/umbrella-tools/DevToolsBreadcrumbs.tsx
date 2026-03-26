"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getDevToolBySlug } from "@/lib/umbrella-tools/tools-config";

export function DevToolsBreadcrumbs() {
  const pathname = usePathname();
  if (!pathname.startsWith("/dev-tools")) return null;

  const segments = pathname.replace(/^\//, "").split("/").filter(Boolean);
  const crumbs: { href: string; label: string }[] = [{ href: "/", label: "Home" }];

  if (segments.length === 1 && segments[0] === "dev-tools") {
    crumbs.push({ href: "/dev-tools", label: "Dev tools" });
  } else {
    crumbs.push({ href: "/dev-tools", label: "Dev tools" });
    const rest = segments.slice(1);
    if (rest[0] === "about") {
      crumbs.push({ href: "/dev-tools/about", label: "About" });
    } else if (rest[0]) {
      const tool = getDevToolBySlug(rest[0]);
      crumbs.push({ href: pathname, label: tool?.title ?? rest[0] });
    }
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
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

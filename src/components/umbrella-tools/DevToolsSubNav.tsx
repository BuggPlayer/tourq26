"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function DevToolsSubNav() {
  const pathname = usePathname();

  const onIndexOrTool =
    pathname === "/dev-tools" ||
    (pathname.startsWith("/dev-tools/") && !pathname.startsWith("/dev-tools/about"));
  const onAbout = pathname === "/dev-tools/about";

  return (
    <nav
      className="flex flex-wrap items-center justify-center gap-1 rounded-lg border border-border/50 bg-background/60 p-0.5 sm:inline-flex sm:gap-0"
      aria-label="Developer utilities section"
    >
      <span className="sr-only">Developer utilities:</span>
      <Link
        href="/dev-tools"
        className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors sm:px-4 ${
          onIndexOrTool ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-surface-elevated hover:text-foreground"
        }`}
      >
        All tools
      </Link>
      <Link
        href="/dev-tools/about"
        className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors sm:px-4 ${
          onAbout ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-surface-elevated hover:text-foreground"
        }`}
      >
        About
      </Link>
      <Link
        href="/privacy"
        className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-surface-elevated hover:text-foreground sm:px-4"
      >
        Privacy
      </Link>
    </nav>
  );
}

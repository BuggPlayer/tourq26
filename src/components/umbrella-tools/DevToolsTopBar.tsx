"use client";

import Link from "next/link";
import { ThemeControls } from "@/components/theme/ThemeControls";

const links = [
  { href: "/about", label: "About" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/contact", label: "Contact" },
];

export function DevToolsTopBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-[1680px] items-center justify-between gap-3 px-4 sm:h-[3.75rem] sm:px-6 lg:px-8">
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href="/"
            className="font-display text-lg font-bold tracking-tight text-foreground transition-opacity hover:opacity-90 sm:text-xl"
          >
            torq <span className="text-primary">studio</span>
          </Link>
          <span className="text-muted-foreground/40" aria-hidden>
            /
          </span>
          <Link
            href="/dev-tools"
            className="rounded-md border border-border/60 bg-surface px-2 py-1 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary sm:text-xs"
          >
            DevTools
          </Link>
        </div>

        <nav
          className="flex min-w-0 max-w-[55vw] flex-nowrap items-center justify-end gap-x-2 overflow-x-auto text-[11px] sm:max-w-none sm:flex-wrap sm:gap-x-5 sm:text-sm"
          aria-label="Site links"
        >
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center border-l border-border/50 pl-3 sm:pl-4">
          <ThemeControls />
        </div>
      </div>
    </header>
  );
}

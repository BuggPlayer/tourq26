"use client";

import Link from "next/link";
import { DevToolsLanguageSelect } from "@/components/umbrella-tools/DevToolsLanguageSelect";
import { useDevToolsLocale } from "@/components/umbrella-tools/DevToolsLocaleProvider";
import { ThemeControls } from "@/components/theme/ThemeControls";

export function DevToolsTopBar() {
  const { messages } = useDevToolsLocale();

  const links = [
    { href: "/about", label: messages.nav.about },
    { href: "/privacy", label: messages.nav.privacy },
    { href: "/terms", label: messages.nav.terms },
    { href: "/contact", label: messages.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-[1680px] items-center justify-between gap-2 px-4 sm:h-[3.75rem] sm:gap-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3">
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
            {messages.topBar.devTools}
          </Link>
        </div>

        <nav
          className="flex min-w-0 max-w-[42vw] flex-nowrap items-center justify-end gap-x-2 overflow-x-auto text-[11px] sm:max-w-none sm:flex-wrap sm:gap-x-5 sm:text-sm"
          aria-label={messages.topBar.siteLinks}
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

        <div className="flex shrink-0 items-center gap-2 border-l border-border/50 pl-2 sm:gap-3 sm:pl-4">
          <DevToolsLanguageSelect />
          <ThemeControls />
        </div>
      </div>
    </header>
  );
}

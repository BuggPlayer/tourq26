"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { DevToolsLanguageSelect } from "@/components/umbrella-tools/DevToolsLanguageSelect";
import { useDevToolsLocale } from "@/components/umbrella-tools/DevToolsLocaleProvider";
import {
  DevToolsSiteLinksMenu,
  DevToolsSiteLinksMenuTrigger,
} from "@/components/umbrella-tools/DevToolsSiteLinksMenu";
import { ThemeControls } from "@/components/theme/ThemeControls";
import { getDevToolsHrefForLocale } from "@/lib/dev-tools-locale-path";

export function DevToolsTopBar() {
  const { messages, locale } = useDevToolsLocale();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: "/about", label: messages.nav.about },
    { href: "/privacy", label: messages.nav.privacy },
    { href: "/terms", label: messages.nav.terms },
    { href: "/contact", label: messages.nav.contact },
  ];

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const toggleMenu = useCallback(() => setMenuOpen((o) => !o), []);

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/65 shadow-[inset_0_1px_0_0_rgb(255_255_255/0.04)] backdrop-blur-2xl supports-[backdrop-filter]:bg-background/55 dark:border-white/[0.06] dark:shadow-[inset_0_1px_0_0_rgb(255_255_255/0.06)]">
      <div
        className="mx-auto grid max-w-[1680px] grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 px-[max(0.75rem,env(safe-area-inset-left,0px))] pe-[max(0.75rem,env(safe-area-inset-right,0px))] pb-1.5 pt-[max(0.35rem,env(safe-area-inset-top,0px))] sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:gap-x-2 sm:px-4 sm:pb-0 sm:pt-0 sm:h-[3.25rem] lg:px-6"
      >
        <div className="col-start-1 row-start-1 flex min-w-0 items-center gap-1.5 sm:gap-3">
          <Link
            href="/"
            className="min-w-0 truncate font-display text-sm font-bold tracking-tight text-foreground transition-opacity hover:opacity-90 sm:text-base lg:text-lg"
          >
            torq <span className="text-primary">studio</span>
          </Link>
          <span className="shrink-0 text-muted-foreground/40" aria-hidden>
            /
          </span>
          <Link
            href={getDevToolsHrefForLocale("/dev-tools", locale)}
            className="shrink-0 rounded-lg border border-border/50 bg-surface-elevated/80 px-2 py-1.5 font-sans text-[10px] font-semibold uppercase leading-none tracking-[0.14em] text-muted-foreground shadow-sm ring-1 ring-inset ring-white/[0.04] transition-all hover:border-primary/35 hover:text-primary hover:shadow-[0_0_20px_-8px_rgb(245_158_11/0.35)] sm:px-2.5 sm:py-1 sm:text-xs sm:tracking-[0.14em]"
          >
            {messages.topBar.devTools}
          </Link>
        </div>

        <nav
          className="hidden min-w-0 flex-wrap items-center justify-end gap-x-3 gap-y-1 text-xs sm:col-start-2 sm:row-start-1 sm:flex sm:text-sm lg:gap-x-4"
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

        <div className="col-start-2 row-start-1 flex shrink-0 items-center justify-end gap-1 sm:col-start-3 sm:gap-2 sm:border-l sm:border-border/50 sm:pl-3 [&_button]:h-10 [&_button]:w-10 [&_button]:shrink-0 sm:[&_button]:h-8 sm:[&_button]:w-8 [&_select]:min-h-10 [&_select]:py-1.5 sm:[&_select]:min-h-0 sm:[&_select]:py-1">
          <DevToolsSiteLinksMenuTrigger
            open={menuOpen}
            onToggle={toggleMenu}
            openLabel={messages.topBar.openSiteMenu}
            closeLabel={messages.topBar.closeSiteMenu}
          />
          <DevToolsLanguageSelect />
          <ThemeControls />
        </div>
      </div>

      <DevToolsSiteLinksMenu
        open={menuOpen}
        onClose={closeMenu}
        links={links}
        menuHeading={messages.topBar.siteMenuHeading}
        closeLabel={messages.topBar.closeSiteMenu}
      />
    </header>
  );
}

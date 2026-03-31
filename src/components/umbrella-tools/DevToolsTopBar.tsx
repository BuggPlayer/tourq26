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
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80">
      <div
        className="mx-auto grid max-w-[1680px] grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 px-[max(1rem,env(safe-area-inset-left,0px))] pe-[max(1rem,env(safe-area-inset-right,0px))] pb-2 pt-[max(0.5rem,env(safe-area-inset-top,0px))] sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:gap-x-3 sm:px-6 sm:pb-0 sm:pt-0 sm:h-[3.75rem] lg:px-8"
      >
        <div className="col-start-1 row-start-1 flex min-w-0 items-center gap-1.5 sm:gap-3">
          <Link
            href="/"
            className="min-w-0 truncate font-display text-base font-bold tracking-tight text-foreground transition-opacity hover:opacity-90 sm:text-lg lg:text-xl"
          >
            torq <span className="text-primary">studio</span>
          </Link>
          <span className="shrink-0 text-muted-foreground/40" aria-hidden>
            /
          </span>
          <Link
            href={getDevToolsHrefForLocale("/dev-tools", locale)}
            className="shrink-0 rounded-md border border-border/60 bg-surface px-2 py-1.5 font-sans text-[10px] font-semibold uppercase leading-none tracking-[0.12em] text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary sm:px-2 sm:py-1 sm:text-xs sm:tracking-[0.14em]"
          >
            {messages.topBar.devTools}
          </Link>
        </div>

        <nav
          className="hidden min-w-0 flex-wrap items-center justify-end gap-x-4 gap-y-1 text-sm sm:col-start-2 sm:row-start-1 sm:flex lg:gap-x-5"
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

        <div className="col-start-2 row-start-1 flex shrink-0 items-center justify-end gap-1.5 sm:col-start-3 sm:gap-3 sm:border-l sm:border-border/50 sm:pl-4 [&_button]:h-11 [&_button]:w-11 [&_button]:shrink-0 sm:[&_button]:h-9 sm:[&_button]:w-9 [&_select]:min-h-11 [&_select]:py-2 sm:[&_select]:min-h-0 sm:[&_select]:py-1.5">
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

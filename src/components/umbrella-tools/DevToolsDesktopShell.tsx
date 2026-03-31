"use client";

import { useCallback, useEffect, useId, useState, type ReactNode } from "react";
import { useDevToolsLocale } from "@/components/umbrella-tools/DevToolsLocaleProvider";
import { DevToolsAside } from "@/components/umbrella-tools/DevToolsAside";

const SIDEBAR_COLLAPSED_KEY = "dev-tools-sidebar-collapsed";

function SidebarRailIcon({ expanded, rtl }: { expanded: boolean; rtl: boolean }) {
  /* Expanded: bar on outer edge + chevron toward main (collapse). Collapsed: opposite to expand. */
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      className={["shrink-0 text-foreground/65", rtl ? "scale-x-[-1]" : ""].filter(Boolean).join(" ")}
      aria-hidden
    >
      {expanded ? (
        <>
          <path
            d="M3 2.5v9"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
          <path
            d="M6 7l4.25-3.25v6.5L6 7z"
            fill="currentColor"
          />
        </>
      ) : (
        <>
          <path
            d="M11 2.5v9"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
          <path
            d="M8 7L3.75 3.75v6.5L8 7z"
            fill="currentColor"
          />
        </>
      )}
    </svg>
  );
}

export function DevToolsDesktopShell({
  sidebar,
  children,
}: {
  sidebar: ReactNode;
  children: ReactNode;
}) {
  const { messages, dir } = useDevToolsLocale();
  const rtl = dir === "rtl";
  const panelId = useId();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
      if (raw === "1") setCollapsed(true);
    } catch {
      /* private mode */
    }
  }, []);

  const toggle = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SIDEBAR_COLLAPSED_KEY, next ? "1" : "0");
      } catch {
        /* */
      }
      return next;
    });
  }, []);

  return (
    <div className="mx-auto flex w-full min-w-0 max-w-full flex-1">
      <div
        id={panelId}
        className={[
          "relative hidden shrink-0 overflow-hidden transition-[width] duration-200 ease-out lg:block",
          collapsed
            ? "w-0 border-transparent"
            : "w-[min(100%,16rem)] border-r border-border/40 bg-surface/35 shadow-[inset_-1px_0_0_0_rgb(255_255_255/0.03)] backdrop-blur-md supports-[backdrop-filter]:bg-surface/25 dark:border-white/[0.05]",
        ].join(" ")}
        aria-hidden={collapsed}
      >
        <DevToolsAside>{sidebar}</DevToolsAside>
      </div>

      <div className="relative hidden w-0 shrink-0 self-stretch lg:block">
        <button
          type="button"
          onClick={toggle}
          aria-expanded={!collapsed}
          aria-controls={panelId}
          title={collapsed ? messages.sidebar.expandToolsMenu : messages.sidebar.collapseToolsMenu}
          className="absolute left-1/2 top-[4.75rem] z-40 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-md border border-border/60 bg-background text-[13px] shadow-sm transition-[color,box-shadow,background-color] hover:bg-surface-elevated hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <span className="sr-only">
            {collapsed ? messages.sidebar.expandToolsMenu : messages.sidebar.collapseToolsMenu}
          </span>
          <SidebarRailIcon expanded={!collapsed} rtl={rtl} />
        </button>
      </div>

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

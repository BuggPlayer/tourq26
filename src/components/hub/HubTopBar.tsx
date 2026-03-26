"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useHubUi, type HubThemePreference } from "@/stores/hub-ui-store";

export function HubTopBar() {
  const { data } = useSession();
  const theme = useHubUi((s) => s.theme);
  const setTheme = useHubUi((s) => s.setTheme);
  const sidebarCollapsed = useHubUi((s) => s.sidebarCollapsed);
  const toggleSidebarCollapsed = useHubUi((s) => s.toggleSidebarCollapsed);
  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b px-4 py-3 backdrop-blur lg:px-8"
      style={{
        borderColor: "var(--hub-border, #1e293b)",
        backgroundColor: "color-mix(in srgb, var(--hub-page-bg, #020617) 88%, transparent)",
      }}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          type="button"
          onClick={toggleSidebarCollapsed}
          className="hidden shrink-0 rounded-lg border px-3 py-1.5 text-sm transition-colors hover:opacity-90 lg:inline-flex"
          style={{
            color: "var(--hub-page-fg, #f1f5f9)",
            borderColor: "var(--hub-border, #334155)",
            backgroundColor: "color-mix(in srgb, var(--hub-elevated) 60%, transparent)",
          }}
          aria-pressed={!sidebarCollapsed}
          aria-label={
            sidebarCollapsed
              ? "Show sidebar navigation"
              : "Hide sidebar navigation"
          }
        >
          {sidebarCollapsed ? "Show sidebar" : "Hide sidebar"}
        </button>
        <div className="hidden min-w-0 text-sm lg:block" style={{ color: "var(--hub-muted)" }}>
          Signed in as{" "}
          <span className="font-medium" style={{ color: "var(--hub-page-fg)" }}>
            {data?.user?.email ?? "Guest"}
          </span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <label className="sr-only" htmlFor="hub-theme">
          Theme
        </label>
        <select
          id="hub-theme"
          value={theme}
          onChange={(e) => setTheme(e.target.value as HubThemePreference)}
          className="rounded-lg border px-2 py-1.5 text-sm"
          style={{
            borderColor: "var(--hub-border, #334155)",
            backgroundColor: "var(--hub-elevated, #0f172a)",
            color: "var(--hub-page-fg, #f1f5f9)",
          }}
          aria-label="Color theme"
        >
          <option value="system">System</option>
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </select>
        {data?.user ? (
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/hub" })}
            className="rounded-lg border px-3 py-1.5 text-sm transition-colors hover:opacity-90"
            style={{
              borderColor: "var(--hub-border, #334155)",
              color: "var(--hub-page-fg, #f1f5f9)",
              backgroundColor: "transparent",
            }}
          >
            Sign out
          </button>
        ) : (
          <Link
            href="/hub/signin"
            className="rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-foreground hover:bg-primary-hover"
          >
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}

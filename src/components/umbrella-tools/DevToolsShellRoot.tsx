"use client";

import type { ReactNode } from "react";
import { useDevToolsLocale } from "@/components/umbrella-tools/DevToolsLocaleProvider";

/**
 * Applies `lang` and `dir` for the dev-tools shell (RTL for Arabic, etc.).
 */
export function DevToolsShellRoot({ children }: { children: ReactNode }) {
  const { htmlLang, dir } = useDevToolsLocale();

  return (
    <div
      className="relative flex min-h-screen min-h-[100dvh] w-full max-w-full flex-col overflow-x-clip bg-background"
      lang={htmlLang}
      dir={dir}
    >
      {/* Ambient mesh — premium depth without heavy imagery */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-background"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.85] dark:opacity-100"
        style={{
          background: `
            radial-gradient(ellipse 120% 70% at 50% -35%, var(--app-primary-muted), transparent 52%),
            radial-gradient(ellipse 70% 50% at 100% 0%, var(--app-accent-muted), transparent 58%),
            radial-gradient(ellipse 65% 45% at 0% 105%, rgb(245 158 11 / 0.05), transparent 50%)
          `,
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(180deg,rgb(0_0_0/0)_0%,rgb(0_0_0/0.12)_100%)] dark:bg-[linear-gradient(180deg,rgb(0_0_0/0)_0%,rgb(0_0_0/0.35)_100%)]"
        aria-hidden
      />
      {children}
    </div>
  );
}

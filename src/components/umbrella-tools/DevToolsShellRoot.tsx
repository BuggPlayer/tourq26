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
      className="flex min-h-screen min-h-[100dvh] w-full max-w-full flex-col overflow-x-clip bg-background"
      lang={htmlLang}
      dir={dir}
    >
      {children}
    </div>
  );
}

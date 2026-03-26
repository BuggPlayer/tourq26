"use client";

import type { ReactNode } from "react";
import { useDevToolsLocale } from "@/components/umbrella-tools/DevToolsLocaleProvider";

export function DevToolsAside({ children }: { children: ReactNode }) {
  const { messages } = useDevToolsLocale();

  return (
    <aside
      className="sticky top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-[min(100%,18rem)] shrink-0 flex-col border-r border-border/50 bg-surface/50 sm:top-[3.75rem] sm:h-[calc(100vh-3.75rem)] lg:flex"
      aria-label={messages.sidebar.toolsByCategory}
    >
      {children}
    </aside>
  );
}

"use client";

import type { ReactNode } from "react";
import { useDevToolsLocale } from "@/components/umbrella-tools/DevToolsLocaleProvider";

export function DevToolsAside({ children }: { children: ReactNode }) {
  const { messages } = useDevToolsLocale();

  return (
    <aside
      className="sticky top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full min-w-0 shrink-0 flex-col sm:top-[3.75rem] sm:h-[calc(100vh-3.75rem)] lg:flex"
      aria-label={messages.sidebar.toolsByCategory}
    >
      {children}
    </aside>
  );
}

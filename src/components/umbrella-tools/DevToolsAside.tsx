"use client";

import type { ReactNode } from "react";
import { useDevToolsLocale } from "@/components/umbrella-tools/DevToolsLocaleProvider";

export function DevToolsAside({ children }: { children: ReactNode }) {
  const { messages } = useDevToolsLocale();

  return (
    <aside
      className="sticky top-[3.25rem] z-30 hidden h-[calc(100dvh-3.25rem)] w-full min-w-0 shrink-0 flex-col lg:flex"
      aria-label={messages.sidebar.toolsByCategory}
    >
      {children}
    </aside>
  );
}

"use client";

import type { ReactNode } from "react";
import { SiteThemeProvider } from "./SiteThemeProvider";
import { ThemeColorMeta } from "./ThemeColorMeta";

export function ThemeShell({ children }: { children: ReactNode }) {
  return (
    <SiteThemeProvider>
      <ThemeColorMeta />
      {children}
    </SiteThemeProvider>
  );
}

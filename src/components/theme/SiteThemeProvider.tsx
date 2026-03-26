"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { SITE_THEME_STORAGE_KEY } from "@/lib/theme-storage";

/**
 * Class-based theming on `<html>` (`light` | `dark` | `system`).
 * Default is **system** so new visitors match `prefers-color-scheme`; explicit choice persists in localStorage.
 */
export function SiteThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey={SITE_THEME_STORAGE_KEY}
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}

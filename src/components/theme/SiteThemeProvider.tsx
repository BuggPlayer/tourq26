"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

/**
 * Class-based theming on `<html>` (`light` | `dark`). All colors/fonts resolve via CSS variables in `globals.css`.
 */
export function SiteThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem storageKey="torq-ui-theme" disableTransitionOnChange>
      {children}
    </ThemeProvider>
  );
}

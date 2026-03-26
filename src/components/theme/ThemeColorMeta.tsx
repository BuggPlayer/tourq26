"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";

/** Syncs `<meta name="theme-color">` with the active palette (see `--app-theme-color` in globals.css). */
export function ThemeColorMeta() {
  const { resolvedTheme, theme } = useTheme();

  useEffect(() => {
    const content = getComputedStyle(document.documentElement).getPropertyValue("--app-theme-color").trim();
    if (!content) return;
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "theme-color");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", content);
  }, [resolvedTheme, theme]); /* re-run when class on html updates palette */

  return null;
}

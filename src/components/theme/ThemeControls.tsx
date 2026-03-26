"use client";

import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";
import { useIsClient } from "@/hooks/use-is-client";

type FontFamily = "brand" | "system";

export function ThemeControls() {
  const { setTheme, resolvedTheme } = useTheme();
  const mounted = useIsClient();

  const persistedFont = useMemo((): FontFamily => {
    if (!mounted) return "brand";
    try {
      const stored = localStorage.getItem("torq-font-family");
      return stored === "system" ? "system" : "brand";
    } catch {
      return "brand";
    }
  }, [mounted]);

  const [fontOverride, setFontOverride] = useState<FontFamily | null>(null);
  const fontFamily = fontOverride ?? persistedFont;

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.dataset.fontFamily = fontFamily;
  }, [mounted, fontFamily]);

  const cycleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const onFontChange = (next: FontFamily) => {
    setFontOverride(next);
    try {
      localStorage.setItem("torq-font-family", next);
    } catch {
      /* quota / private mode */
    }
    document.documentElement.dataset.fontFamily = next;
  };

  if (!mounted) {
    return (
      <div className="flex items-center gap-2" aria-hidden>
        <div className="h-9 w-20 rounded-lg bg-muted/30" />
        <div className="h-9 w-9 rounded-lg bg-muted/30" />
      </div>
    );
  }

  const label = `Color theme: switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`;

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <label className="sr-only" htmlFor="torq-font-family">
        Font
      </label>
      <select
        id="torq-font-family"
        value={fontFamily}
        onChange={(e) => onFontChange(e.target.value as FontFamily)}
        className="rounded-lg border border-border bg-background/80 px-2 py-1.5 text-xs font-medium text-foreground shadow-sm backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="brand">Brand fonts</option>
        <option value="system">System UI</option>
      </select>
      <button
        type="button"
        onClick={cycleTheme}
        title={label}
        aria-label={label}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background/80 text-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {resolvedTheme === "dark" ? (
          <SunIcon className="h-4 w-4" />
        ) : (
          <MoonIcon className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  );
}

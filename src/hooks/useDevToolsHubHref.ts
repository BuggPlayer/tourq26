"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  DEFAULT_DEV_TOOLS_LOCALE,
  DEV_TOOLS_LOCALE_COOKIE,
  DEV_TOOLS_LOCALE_STORAGE_KEY,
  isDevToolsLocaleId,
  type DevToolsLocaleId,
} from "@/lib/dev-tools-locale";
import { getDevToolsHrefForLocale, getLocaleFromDevToolsPathname } from "@/lib/dev-tools-locale-path";

function readClientPreferredLocale(): DevToolsLocaleId {
  if (typeof window === "undefined") return DEFAULT_DEV_TOOLS_LOCALE;
  try {
    const raw = localStorage.getItem(DEV_TOOLS_LOCALE_STORAGE_KEY);
    if (raw && isDevToolsLocaleId(raw)) return raw;
  } catch {
    /* private mode */
  }
  const parts = `; ${document.cookie}`.split(`; ${DEV_TOOLS_LOCALE_COOKIE}=`);
  if (parts.length === 2) {
    const rest = parts.pop()?.split(";").shift();
    if (rest) {
      try {
        const val = decodeURIComponent(rest);
        if (isDevToolsLocaleId(val)) return val;
      } catch {
        /* */
      }
    }
  }
  return DEFAULT_DEV_TOOLS_LOCALE;
}

/**
 * Hub URL for main-site nav: respects `/{locale}/dev-tools` when path encodes locale,
 * otherwise cookie + localStorage (same preference as DevToolsLocaleProvider).
 */
export function useDevToolsHubHref(): string {
  const pathname = usePathname();
  const [href, setHref] = useState(() => {
    const fromPath = getLocaleFromDevToolsPathname(pathname);
    if (fromPath !== null) return getDevToolsHrefForLocale("/dev-tools", fromPath);
    return "/dev-tools";
  });

  useEffect(() => {
    const fromPath = getLocaleFromDevToolsPathname(pathname);
    if (fromPath !== null) {
      setHref(getDevToolsHrefForLocale("/dev-tools", fromPath));
      return;
    }
    const stored = readClientPreferredLocale();
    setHref(getDevToolsHrefForLocale("/dev-tools", stored));
  }, [pathname]);

  return href;
}

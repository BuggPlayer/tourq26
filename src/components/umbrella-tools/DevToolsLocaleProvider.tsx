"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_DEV_TOOLS_LOCALE,
  DEV_TOOLS_LOCALE_COOKIE,
  DEV_TOOLS_LOCALE_STORAGE_KEY,
  getLocaleOption,
  isDevToolsLocaleId,
  type DevToolsLocaleId,
} from "@/lib/dev-tools-locale";
import { getDevToolsMessages, type DevToolsMessages } from "@/lib/dev-tools-messages";

type DevToolsLocaleContextValue = {
  locale: DevToolsLocaleId;
  setLocale: (id: DevToolsLocaleId) => void;
  messages: DevToolsMessages;
  htmlLang: string;
  dir: "ltr" | "rtl";
};

const DevToolsLocaleContext = createContext<DevToolsLocaleContextValue | null>(null);

function readStoredLocale(): DevToolsLocaleId {
  if (typeof window === "undefined") return DEFAULT_DEV_TOOLS_LOCALE;
  try {
    const raw = localStorage.getItem(DEV_TOOLS_LOCALE_STORAGE_KEY);
    if (raw && isDevToolsLocaleId(raw)) return raw;
  } catch {
    /* private mode */
  }
  return DEFAULT_DEV_TOOLS_LOCALE;
}

function persistLocale(id: DevToolsLocaleId) {
  try {
    localStorage.setItem(DEV_TOOLS_LOCALE_STORAGE_KEY, id);
  } catch {
    /* quota */
  }
  try {
    document.cookie = `${DEV_TOOLS_LOCALE_COOKIE}=${encodeURIComponent(id)};path=/;max-age=31536000;SameSite=Lax`;
  } catch {
    /* */
  }
}

export function DevToolsLocaleProvider({
  children,
  initialLocale,
}: {
  children: ReactNode;
  /** From `cookies()` on the server so first paint matches returning visitors. */
  initialLocale?: DevToolsLocaleId;
}) {
  const [locale, setLocaleState] = useState<DevToolsLocaleId>(
    () => initialLocale ?? DEFAULT_DEV_TOOLS_LOCALE,
  );

  /* After mount, prefer localStorage so client-only preference wins over cookie-less SSR. */
  useEffect(() => {
    const stored = readStoredLocale();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot sync from localStorage post-hydration
    setLocaleState((prev) => (stored !== prev ? stored : prev));
  }, []);

  const setLocale = useCallback((id: DevToolsLocaleId) => {
    setLocaleState(id);
    persistLocale(id);
  }, []);

  const option = getLocaleOption(locale);
  const messages = useMemo(() => getDevToolsMessages(locale), [locale]);

  const value = useMemo<DevToolsLocaleContextValue>(
    () => ({
      locale,
      setLocale,
      messages,
      htmlLang: option.htmlLang,
      dir: option.dir,
    }),
    [locale, setLocale, messages, option.htmlLang, option.dir],
  );

  return <DevToolsLocaleContext.Provider value={value}>{children}</DevToolsLocaleContext.Provider>;
}

export function useDevToolsLocale(): DevToolsLocaleContextValue {
  const ctx = useContext(DevToolsLocaleContext);
  if (!ctx) {
    throw new Error("useDevToolsLocale must be used under DevToolsLocaleProvider");
  }
  return ctx;
}

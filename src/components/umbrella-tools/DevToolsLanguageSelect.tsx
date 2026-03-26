"use client";

import { DEV_TOOLS_LOCALE_OPTIONS, type DevToolsLocaleId } from "@/lib/dev-tools-locale";
import { useDevToolsLocale } from "@/components/umbrella-tools/DevToolsLocaleProvider";

/**
 * Chrome DevTools–style display language control: native names, `<select>` for accessibility.
 */
export function DevToolsLanguageSelect() {
  const { locale, setLocale, messages } = useDevToolsLocale();

  return (
    <>
      <label className="sr-only" htmlFor="dev-tools-display-language">
        {messages.languageSelectAria}
      </label>
      <select
      id="dev-tools-display-language"
      value={locale}
      onChange={(e) => setLocale(e.target.value as DevToolsLocaleId)}
      className="max-w-[min(100%,11rem)] rounded-lg border border-border bg-background/80 py-1.5 pl-2 pr-7 text-xs font-medium text-foreground shadow-sm backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-ring sm:max-w-[13rem]"
      aria-label={messages.languageSelectAria}
    >
      {DEV_TOOLS_LOCALE_OPTIONS.map((opt) => (
        <option key={opt.id} value={opt.id}>
          {opt.label}
        </option>
      ))}
    </select>
    </>
  );
}

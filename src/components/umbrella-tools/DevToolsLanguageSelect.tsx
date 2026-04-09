"use client";

import { usePathname, useRouter } from "next/navigation";
import { DEV_TOOLS_LOCALE_OPTIONS, type DevToolsLocaleId } from "@/lib/dev-tools-locale";
import { useDevToolsLocale } from "@/components/umbrella-tools/DevToolsLocaleProvider";
import { swapDevToolsLocaleInPath } from "@/lib/dev-tools-locale-path";

/**
 * Chrome DevTools–style display language control: native names, `<select>` for accessibility.
 */
export function DevToolsLanguageSelect() {
  const { locale, setLocale, messages } = useDevToolsLocale();
  const pathname = usePathname();
  const router = useRouter();

  if (DEV_TOOLS_LOCALE_OPTIONS.length <= 1) {
    return null;
  }

  return (
    <>
      <label className="sr-only" htmlFor="dev-tools-display-language">
        {messages.languageSelectAria}
      </label>
      <select
      id="dev-tools-display-language"
      value={locale}
      onChange={(e) => {
        const id = e.target.value as DevToolsLocaleId;
        setLocale(id);
        router.push(swapDevToolsLocaleInPath(pathname, id));
      }}
      className="min-h-11 max-w-[min(100%,10rem)] rounded-lg border border-border bg-background/80 py-2 pl-2 pr-8 text-xs font-medium text-foreground shadow-sm backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-ring sm:min-h-0 sm:max-w-[13rem] sm:py-1.5 sm:pr-7"
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

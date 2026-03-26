/**
 * Display languages for /dev-tools (Chrome DevTools–style picker: native names, BCP-47 ids).
 */

export type DevToolsLocaleId = "en" | "ar" | "es" | "fr" | "de" | "pt-BR" | "ja" | "zh-CN";

export const DEV_TOOLS_LOCALE_STORAGE_KEY = "torq-dev-tools-locale";

export const DEV_TOOLS_LOCALE_COOKIE = "torq_dev_tools_locale";

/** Ordered list for the dropdown (market-standard: native endonyms). */
export const DEV_TOOLS_LOCALE_OPTIONS: readonly {
  id: DevToolsLocaleId;
  /** Shown in the menu (native name). */
  label: string;
  /** Document / HTML `lang` */
  htmlLang: string;
  dir: "ltr" | "rtl";
}[] = [
  { id: "en", label: "English", htmlLang: "en", dir: "ltr" },
  { id: "ar", label: "العربية", htmlLang: "ar", dir: "rtl" },
  { id: "es", label: "Español", htmlLang: "es", dir: "ltr" },
  { id: "fr", label: "Français", htmlLang: "fr", dir: "ltr" },
  { id: "de", label: "Deutsch", htmlLang: "de", dir: "ltr" },
  { id: "pt-BR", label: "Português (Brasil)", htmlLang: "pt-BR", dir: "ltr" },
  { id: "ja", label: "日本語", htmlLang: "ja", dir: "ltr" },
  { id: "zh-CN", label: "简体中文", htmlLang: "zh-CN", dir: "ltr" },
] as const;

export const DEFAULT_DEV_TOOLS_LOCALE: DevToolsLocaleId = "en";

export function isDevToolsLocaleId(value: string | null | undefined): value is DevToolsLocaleId {
  return DEV_TOOLS_LOCALE_OPTIONS.some((o) => o.id === value);
}

export function getLocaleOption(id: DevToolsLocaleId) {
  return DEV_TOOLS_LOCALE_OPTIONS.find((o) => o.id === id) ?? DEV_TOOLS_LOCALE_OPTIONS[0]!;
}

import type { DevToolsLocaleId } from "@/lib/dev-tools-locale";

/**
 * URL segment ↔ locale (non-English only). English uses unprefixed `/dev-tools/...`.
 * `pt-BR` → `pt-br`, `zh-CN` → `zh-cn` (lowercase in paths).
 *
 * Temporary: empty while only English is active — uncomment entries together with `dev-tools-locale.ts` locales.
 */
export const LOCALE_TO_PATH_SEGMENT = {} as Record<Exclude<DevToolsLocaleId, "en">, string>;
// {
//   ar: "ar",
//   es: "es",
//   fr: "fr",
//   de: "de",
//   "pt-BR": "pt-br",
//   ja: "ja",
//   "zh-CN": "zh-cn",
// };

const PATH_SEGMENT_TO_LOCALE = Object.fromEntries(
  (Object.entries(LOCALE_TO_PATH_SEGMENT) as [Exclude<DevToolsLocaleId, "en">, string][]).map(([loc, seg]) => [
    seg.toLowerCase(),
    loc as DevToolsLocaleId,
  ]),
) as Record<string, DevToolsLocaleId>;

export function localeToPathSegment(locale: Exclude<DevToolsLocaleId, "en">): string | undefined {
  return LOCALE_TO_PATH_SEGMENT[locale];
}

/** Returns locale if `segment` is a known non-English dev-tools prefix. */
export function pathSegmentToLocale(segment: string): DevToolsLocaleId | null {
  return PATH_SEGMENT_TO_LOCALE[segment.toLowerCase()] ?? null;
}

/** All non-English path segments (for `generateStaticParams`). */
export function getAllNonEnLocalePathSegments(): string[] {
  return Object.values(LOCALE_TO_PATH_SEGMENT);
}

/**
 * Normalized path always starts with `/dev-tools` (no locale prefix).
 * Examples: `/dev-tools`, `/dev-tools/json-formatter`, `/dev-tools/about`
 */
/** True when `pathname` is the dev-tools area (unprefixed `/dev-tools/...` or `/{locale}/dev-tools/...`). */
export function isDevToolsPathname(pathname: string): boolean {
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] === "dev-tools") return true;
  if (parts.length >= 2 && parts[1] === "dev-tools") {
    return pathSegmentToLocale(parts[0]!) !== null;
  }
  return false;
}

export function getDevToolsCanonicalSuffix(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return "/dev-tools";
  if (parts[0] === "dev-tools") {
    return `/${parts.join("/")}`;
  }
  if (parts.length >= 2 && parts[1] === "dev-tools") {
    return `/${parts.slice(1).join("/")}`;
  }
  return "/dev-tools";
}

/**
 * Locale encoded in the URL path (`/es/dev-tools/...`). Returns `null` for unprefixed `/dev-tools/...`
 * so cookie/localStorage can still drive UI on canonical English URLs.
 */
export function getLocaleFromDevToolsPathname(pathname: string): DevToolsLocaleId | null {
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] === "dev-tools") return null;
  if (parts.length >= 2 && parts[1] === "dev-tools") {
    const loc = pathSegmentToLocale(parts[0]!);
    if (loc) return loc;
  }
  return null;
}

/**
 * Build href for navigation. `suffix` is canonical `/dev-tools...` (from `getDevToolsCanonicalSuffix`).
 */
export function getDevToolsHrefForLocale(suffix: string, locale: DevToolsLocaleId): string {
  if (locale === "en") return suffix;
  const seg = localeToPathSegment(locale as Exclude<DevToolsLocaleId, "en">);
  if (!seg) return suffix;
  return `/${seg}${suffix}`;
}

/** Switch locale while keeping the same tool/hub/about page. */
export function swapDevToolsLocaleInPath(pathname: string, nextLocale: DevToolsLocaleId): string {
  const suffix = getDevToolsCanonicalSuffix(pathname);
  return getDevToolsHrefForLocale(suffix, nextLocale);
}

import { cookies } from "next/headers";
import {
  DEFAULT_DEV_TOOLS_LOCALE,
  DEV_TOOLS_LOCALE_COOKIE,
  isDevToolsLocaleId,
  type DevToolsLocaleId,
} from "@/lib/dev-tools-locale";

/** Resolves display locale for `/dev-tools` on the server (SEO + JSON-LD). */
export async function getDevToolsLocaleFromCookie(): Promise<DevToolsLocaleId> {
  const jar = await cookies();
  const raw = jar.get(DEV_TOOLS_LOCALE_COOKIE)?.value;
  if (!raw) return DEFAULT_DEV_TOOLS_LOCALE;
  let decoded = raw;
  try {
    decoded = decodeURIComponent(raw);
  } catch {
    decoded = raw;
  }
  return isDevToolsLocaleId(decoded) ? decoded : DEFAULT_DEV_TOOLS_LOCALE;
}

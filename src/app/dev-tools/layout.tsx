import { cookies } from "next/headers";
import { DevToolsLocaleProvider } from "@/components/umbrella-tools/DevToolsLocaleProvider";
import { DEV_TOOLS_LOCALE_COOKIE, isDevToolsLocaleId } from "@/lib/dev-tools-locale";

export default async function DevToolsLayout({ children }: { children: React.ReactNode }) {
  const jar = await cookies();
  const raw = jar.get(DEV_TOOLS_LOCALE_COOKIE)?.value;
  let decoded = "";
  if (raw) {
    try {
      decoded = decodeURIComponent(raw);
    } catch {
      decoded = raw;
    }
  }
  const initialLocale = isDevToolsLocaleId(decoded) ? decoded : undefined;

  return <DevToolsLocaleProvider initialLocale={initialLocale}>{children}</DevToolsLocaleProvider>;
}

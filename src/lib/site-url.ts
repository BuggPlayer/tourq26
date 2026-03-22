import { readSiteContent } from "@/lib/content";

/** Canonical site origin — single source of truth (Site & SEO in admin). */
export async function getSiteUrl(): Promise<string> {
  const site = await readSiteContent();
  return site.siteUrl.replace(/\/$/, "");
}

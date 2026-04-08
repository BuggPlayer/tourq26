import type { Metadata } from "next";
import UmbrellaToolsLayout from "@/components/umbrella-tools/UmbrellaToolsLayout";
import { DevToolsHubBody } from "@/components/umbrella-tools/DevToolsHubBody";
import JsonLd from "@/components/JsonLd";
import { getDevToolsLocaleFromCookie } from "@/lib/dev-tools-locale-server";
import { readDevToolsAdminDocument, readSiteContent } from "@/lib/content";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { getDevToolsNavCatalogSorted } from "@/lib/dev-tools-admin";
import { DEV_TOOL_CATEGORY_ORDER } from "@/lib/umbrella-tools/tools-config";
import { devToolsHubIndexMetadata, devToolsHubPageJsonLd } from "@/lib/umbrella-tools/seo";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getDevToolsLocaleFromCookie();
  return devToolsHubIndexMetadata(locale);
}

export default async function DevToolsIndexPage() {
  const adminDoc = await readDevToolsAdminDocument();
  const playgroundOn = await isFeatureEnabled("dev_tools_code_playground");
  const navCatalogTools = getDevToolsNavCatalogSorted(adminDoc, playgroundOn);
  const toolsForHub = navCatalogTools;
  const toolCount = navCatalogTools.length;
  const [siteUrl, site, locale] = await Promise.all([
    getSiteUrl(),
    readSiteContent(),
    getDevToolsLocaleFromCookie(),
  ]);
  const hubLd = devToolsHubPageJsonLd(siteUrl, site.siteName, toolsForHub, locale);

  const sections: { category: (typeof DEV_TOOL_CATEGORY_ORDER)[number]; tools: typeof toolsForHub }[] = [];
  for (const category of DEV_TOOL_CATEGORY_ORDER) {
    const tools = navCatalogTools.filter((t) => t.category === category);
    if (tools.length > 0) sections.push({ category, tools });
  }

  return (
    <UmbrellaToolsLayout catalogTools={navCatalogTools}>
      <JsonLd data={hubLd} />
      <DevToolsHubBody sections={sections} toolCount={toolCount} adminDoc={adminDoc} />
    </UmbrellaToolsLayout>
  );
}

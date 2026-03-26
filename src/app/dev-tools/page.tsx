import type { Metadata } from "next";
import UmbrellaToolsLayout from "@/components/umbrella-tools/UmbrellaToolsLayout";
import { DevToolsHubBody } from "@/components/umbrella-tools/DevToolsHubBody";
import JsonLd from "@/components/JsonLd";
import { getDevToolsLocaleFromCookie } from "@/lib/dev-tools-locale-server";
import { getDevToolsSeoMessages } from "@/lib/dev-tools-seo-messages";
import { readDevToolsAdminDocument, readSiteContent } from "@/lib/content";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { filterUmbrellaToolsByAdmin, sortUmbrellaToolsForHub } from "@/lib/dev-tools-admin";
import {
  DEV_TOOL_CATEGORY_ORDER,
  filterCodePlaygroundFromCatalog,
  UMBRELLA_TOOLS,
  toolsByCategory,
} from "@/lib/umbrella-tools/tools-config";
import { devToolsHubPageJsonLd, DEV_TOOLS_OG_IMAGE_PATH, umbrellaToolsMetadata } from "@/lib/umbrella-tools/seo";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getDevToolsLocaleFromCookie();
  const seo = getDevToolsSeoMessages(locale);
  return umbrellaToolsMetadata({
    title: seo.hub.title,
    description: seo.hub.description,
    path: "/dev-tools",
    keywords: seo.hub.keywords,
    ogImagePath: DEV_TOOLS_OG_IMAGE_PATH,
    titleSuffix: seo.titleSuffix,
  });
}

export default async function DevToolsIndexPage() {
  const adminDoc = await readDevToolsAdminDocument();
  const playgroundOn = await isFeatureEnabled("dev_tools_code_playground");
  const catalogTools = filterCodePlaygroundFromCatalog(UMBRELLA_TOOLS, playgroundOn);
  const toolsForHub = sortUmbrellaToolsForHub(filterUmbrellaToolsByAdmin(catalogTools, adminDoc), adminDoc);
  const toolCount = filterUmbrellaToolsByAdmin(catalogTools, adminDoc).length;
  const [siteUrl, site, locale] = await Promise.all([
    getSiteUrl(),
    readSiteContent(),
    getDevToolsLocaleFromCookie(),
  ]);
  const hubLd = devToolsHubPageJsonLd(siteUrl, site.siteName, toolsForHub, locale);

  const sections: { category: (typeof DEV_TOOL_CATEGORY_ORDER)[number]; tools: typeof toolsForHub }[] = [];
  for (const category of DEV_TOOL_CATEGORY_ORDER) {
    const tools = sortUmbrellaToolsForHub(
      filterUmbrellaToolsByAdmin(toolsByCategory(category), adminDoc),
      adminDoc,
    );
    if (tools.length > 0) sections.push({ category, tools });
  }

  return (
    <UmbrellaToolsLayout catalogTools={catalogTools}>
      <JsonLd data={hubLd} />
      <DevToolsHubBody sections={sections} toolCount={toolCount} adminDoc={adminDoc} />
    </UmbrellaToolsLayout>
  );
}

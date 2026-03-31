import type { Metadata } from "next";
import { notFound } from "next/navigation";
import UmbrellaToolsLayout from "@/components/umbrella-tools/UmbrellaToolsLayout";
import { DevToolsHubBody } from "@/components/umbrella-tools/DevToolsHubBody";
import JsonLd from "@/components/JsonLd";
import { readDevToolsAdminDocument, readSiteContent } from "@/lib/content";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { filterUmbrellaToolsByAdmin, sortUmbrellaToolsForHub } from "@/lib/dev-tools-admin";
import {
  getAllNonEnLocalePathSegments,
  pathSegmentToLocale,
} from "@/lib/dev-tools-locale-path";
import {
  DEV_TOOL_CATEGORY_ORDER,
  filterCodePlaygroundFromCatalog,
  UMBRELLA_TOOLS,
  toolsByCategory,
} from "@/lib/umbrella-tools/tools-config";
import { devToolsHubIndexMetadata, devToolsHubPageJsonLd } from "@/lib/umbrella-tools/seo";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return getAllNonEnLocalePathSegments().map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: segment } = await params;
  const locale = pathSegmentToLocale(segment);
  if (!locale) return { title: "Dev tools" };
  return devToolsHubIndexMetadata(locale);
}

export default async function DevToolsPrefixedHubPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: segment } = await params;
  const locale = pathSegmentToLocale(segment);
  if (!locale) notFound();

  const adminDoc = await readDevToolsAdminDocument();
  const playgroundOn = await isFeatureEnabled("dev_tools_code_playground");
  const catalogTools = filterCodePlaygroundFromCatalog(UMBRELLA_TOOLS, playgroundOn);
  const toolsForHub = sortUmbrellaToolsForHub(filterUmbrellaToolsByAdmin(catalogTools, adminDoc), adminDoc);
  const toolCount = filterUmbrellaToolsByAdmin(catalogTools, adminDoc).length;
  const [siteUrl, site] = await Promise.all([getSiteUrl(), readSiteContent()]);
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

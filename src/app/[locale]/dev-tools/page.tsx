import type { Metadata } from "next";
import { notFound } from "next/navigation";
import UmbrellaToolsLayout from "@/components/umbrella-tools/UmbrellaToolsLayout";
import { DevToolsHubBody } from "@/components/umbrella-tools/DevToolsHubBody";
import JsonLd from "@/components/JsonLd";
import { readDevToolsAdminDocument, readSiteContent } from "@/lib/content";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { getDevToolsNavCatalogSorted } from "@/lib/dev-tools-admin";
import {
  getAllNonEnLocalePathSegments,
  pathSegmentToLocale,
} from "@/lib/dev-tools-locale-path";
import { DEV_TOOL_CATEGORY_ORDER } from "@/lib/umbrella-tools/tools-config";
import { devToolsHubIndexMetadata, devToolsHubPageJsonLd } from "@/lib/umbrella-tools/seo";
import { getSiteUrl } from "@/lib/site-url";
import { SupportingProseSection } from "@/components/marketing/SupportingProseSection";

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
  const navCatalogTools = getDevToolsNavCatalogSorted(adminDoc, playgroundOn);
  const toolsForHub = navCatalogTools;
  const toolCount = navCatalogTools.length;
  const [siteUrl, site] = await Promise.all([getSiteUrl(), readSiteContent()]);
  const hubLd = devToolsHubPageJsonLd(siteUrl, site.siteName, toolsForHub, locale);

  const sections: { category: (typeof DEV_TOOL_CATEGORY_ORDER)[number]; tools: typeof toolsForHub }[] = [];
  for (const category of DEV_TOOL_CATEGORY_ORDER) {
    const tools = navCatalogTools.filter((t) => t.category === category);
    if (tools.length > 0) sections.push({ category, tools });
  }

  return (
    <UmbrellaToolsLayout catalogTools={navCatalogTools}>
      <JsonLd data={hubLd} />
      <SupportingProseSection
        id="dev-tools-editorial"
        className="mb-2"
        heading="Browser-based utilities for everyday engineering"
        paragraphs={[
          "Torq Studio maintains this catalog so developers and product teams can format data, debug encodings, generate secrets, inspect tokens, and run quick conversions without installing desktop software. Each tool is designed to be obvious in purpose: paste or upload input, adjust options when needed, then copy or download the result.",
          "Most utilities execute entirely in your browser, which keeps drafts and payloads off our servers for those flows. A small number of helpers may perform a minimal network request when the feature requires it—for example resolving your public IP—and those cases are called out in the FAQ on each page.",
          "We group tools by category so you can skim JSON and YAML formatters, Base32, Base58, and Base64 conversions, cryptographic hashes, HMAC and bcrypt helpers, QR generators, network calculators, PDF utilities, and text helpers in one place. If you need a capability we have not shipped yet, use the contact page to suggest it.",
        ]}
      />
      <DevToolsHubBody sections={sections} toolCount={toolCount} adminDoc={adminDoc} />
    </UmbrellaToolsLayout>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import JsonLd from "@/components/JsonLd";
import UmbrellaToolsLayout from "@/components/umbrella-tools/UmbrellaToolsLayout";
import { DevToolsToolRouter } from "@/components/umbrella-tools/DevToolsToolRouter";
import { readDevToolsAdminDocument, readSiteContent } from "@/lib/content";
import { getDevToolsLocaleFromCookie } from "@/lib/dev-tools-locale-server";
import { devToolsPageMetadata, devToolsToolFullJsonLd } from "@/lib/umbrella-tools/seo";
import { getDevToolBySlug, UMBRELLA_TOOLS } from "@/lib/umbrella-tools/tools-config";
import { getSiteUrl } from "@/lib/site-url";
import { isAdmin } from "@/lib/auth";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { DevToolAccordionContent } from "@/components/umbrella-tools/DevToolAccordionContent";
import {
  getDevToolFaqSchemaPairs,
  getDevToolPublicBelowFold,
  shouldHideRegistryDevToolFaq,
} from "@/lib/dev-tool-editorial";
import { getDevToolFaqItems } from "@/lib/umbrella-tools/dev-tool-faq";
import {
  applyDevToolAdminSeoToTool,
  getDevToolsNavCatalogSorted,
  getRelatedDevToolsFiltered,
  isDevToolEnabled,
} from "@/lib/dev-tools-admin";

/** Admin can disable tools without redeploy; re-evaluate visibility per request. */
export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return UMBRELLA_TOOLS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getDevToolsLocaleFromCookie();
  return devToolsPageMetadata(slug, locale);
}

function ToolFallback() {
  return <p className="text-sm text-muted-foreground">Loading…</p>;
}

export default async function DevToolBySlugPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ adminPreview?: string }>;
}) {
  const { slug } = await params;
  const { adminPreview } = await searchParams;
  const tool = getDevToolBySlug(slug);
  if (!tool) notFound();
  const adminDoc = await readDevToolsAdminDocument();
  const adminBypass = adminPreview === "1" && (await isAdmin());
  if (!adminBypass && !isDevToolEnabled(slug, adminDoc)) notFound();

  const playgroundOn = await isFeatureEnabled("dev_tools_code_playground");
  const navCatalogTools = getDevToolsNavCatalogSorted(adminDoc, playgroundOn);

  const [siteUrl, site, locale] = await Promise.all([
    getSiteUrl(),
    readSiteContent(),
    getDevToolsLocaleFromCookie(),
  ]);
  const registryFaqs = getDevToolFaqItems(slug);
  const faqSchemaPairs = getDevToolFaqSchemaPairs(adminDoc, slug, registryFaqs);
  const structuredData = devToolsToolFullJsonLd({
    siteUrl,
    siteName: site.siteName,
    tool: applyDevToolAdminSeoToTool(tool, adminDoc),
    slug,
    faqSchemaPairs,
    locale,
  });
  const relatedToolsOverride = getRelatedDevToolsFiltered(slug, 6, adminDoc);
  const belowFold = getDevToolPublicBelowFold(adminDoc, slug);
  const hideRegistryFaq = shouldHideRegistryDevToolFaq(belowFold);

  return (
    <UmbrellaToolsLayout
      catalogTools={navCatalogTools}
      relatedToolsOverride={relatedToolsOverride}
      hideRegistryFaq={hideRegistryFaq}
    >
      <>
        <JsonLd data={structuredData} />
        {adminBypass ? (
          <div
            className="mb-6 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-950 dark:text-amber-100"
            role="status"
          >
            <strong className="font-semibold">Admin preview</strong>
            <span className="text-amber-900/90 dark:text-amber-100/90">
              {" "}
              — This URL is only for operators. If the tool is disabled, visitors still get 404; the hub, sidebar, and
              sitemap stay in sync with admin settings.
            </span>
          </div>
        ) : null}
        <Suspense fallback={<ToolFallback />}>
          <DevToolsToolRouter slug={slug} />
        </Suspense>
        <DevToolAccordionContent below={belowFold} />
      </>
    </UmbrellaToolsLayout>
  );
}

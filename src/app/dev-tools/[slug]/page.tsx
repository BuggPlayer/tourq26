import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import JsonLd from "@/components/JsonLd";
import UmbrellaToolsLayout from "@/components/umbrella-tools/UmbrellaToolsLayout";
import { DevToolsToolRouter } from "@/components/umbrella-tools/DevToolsToolRouter";
import { readDevToolsAdminDocument, readSiteContent } from "@/lib/content";
import { devToolsPageMetadata, devToolsToolFullJsonLd } from "@/lib/umbrella-tools/seo";
import { getDevToolBySlug, UMBRELLA_TOOLS } from "@/lib/umbrella-tools/tools-config";
import { getSiteUrl } from "@/lib/site-url";
import { isAdmin } from "@/lib/auth";
import { DevToolEditorialSections } from "@/components/umbrella-tools/DevToolEditorialSections";
import { getDevToolPublicFaqSanitized } from "@/lib/dev-tool-editorial";
import { getRelatedDevToolsFiltered, isDevToolEnabled } from "@/lib/dev-tools-admin";

/** Admin can disable tools without redeploy; re-evaluate visibility per request. */
export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return UMBRELLA_TOOLS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return devToolsPageMetadata(slug);
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

  const [siteUrl, site] = await Promise.all([getSiteUrl(), readSiteContent()]);
  const structuredData = devToolsToolFullJsonLd({ siteUrl, siteName: site.siteName, tool, slug });
  const relatedToolsOverride = getRelatedDevToolsFiltered(slug, 6, adminDoc);
  const publicFaq = getDevToolPublicFaqSanitized(adminDoc, slug);

  return (
    <UmbrellaToolsLayout relatedToolsOverride={relatedToolsOverride}>
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
              — This URL is only for operators. If the tool is disabled, visitors still get 404; the hub and sitemap stay
              in sync with admin settings.
            </span>
          </div>
        ) : null}
        <Suspense fallback={<ToolFallback />}>
          <DevToolsToolRouter slug={slug} />
        </Suspense>
        {publicFaq ? <DevToolEditorialSections html={publicFaq.html} /> : null}
      </>
    </UmbrellaToolsLayout>
  );
}

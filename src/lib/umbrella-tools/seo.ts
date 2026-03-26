import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site-url";
import { readSiteContent } from "@/lib/content";
import { getDevToolBySlug, type UmbrellaTool } from "@/lib/umbrella-tools/tools-config";

const DEFAULT_SUFFIX = "Developer utilities";

/**
 * Build Next.js metadata for umbrella / dev-tools pages (App Router).
 */
export async function umbrellaToolsMetadata(opts: {
  title: string;
  description: string;
  path: string;
  /** Optional SEO keywords (some search engines still use sparingly) */
  keywords?: string[];
}): Promise<Metadata> {
  const [baseUrl, site] = await Promise.all([getSiteUrl(), readSiteContent()]);
  const path = opts.path.startsWith("/") ? opts.path : `/${opts.path}`;
  const url = `${baseUrl}${path}`;
  const pageTitle = `${opts.title} | ${DEFAULT_SUFFIX} | ${site.siteName}`;
  return {
    title: pageTitle,
    description: opts.description,
    ...(opts.keywords?.length ? { keywords: opts.keywords } : {}),
    alternates: { canonical: url },
    openGraph: {
      title: pageTitle,
      description: opts.description,
      url,
      siteName: site.siteName,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: opts.description,
    },
  };
}

/** Metadata for a tool page — pulls title, description, keywords from `tools-config`. */
/** Schema.org ItemList for the /dev-tools hub (rich results / discovery). */
export function devToolsItemListJsonLd(siteUrl: string, tools: UmbrellaTool[]) {
  const base = siteUrl.replace(/\/$/, "");
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Developer utilities",
    numberOfItems: tools.length,
    itemListElement: tools.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.title,
      description: t.description,
      url: `${base}/dev-tools/${t.slug}`,
    })),
  };
}

export async function devToolsPageMetadata(slug: string): Promise<Metadata> {
  const tool = getDevToolBySlug(slug);
  if (!tool) {
    return { title: "Developer tool", robots: { index: false, follow: false } };
  }
  return umbrellaToolsMetadata({
    title: tool.title,
    description: `${tool.description} Free online developer utility — runs locally in your browser. No upload to Torq Studio servers.`,
    path: `/dev-tools/${slug}`,
    keywords: tool.keywords,
  });
}

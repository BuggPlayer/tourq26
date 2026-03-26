import type { Metadata } from "next";
import { readDevToolsAdminDocument, readSiteContent } from "@/lib/content";
import { getDevToolFaqItems } from "@/lib/umbrella-tools/dev-tool-faq";
import { getDevToolBySlugWithAdminSeo } from "@/lib/dev-tools-admin";
import type { UmbrellaTool } from "@/lib/umbrella-tools/tools-config";
import type { DevToolsLocaleId } from "@/lib/dev-tools-locale";
import { DEV_TOOL_CATEGORY_META_TAIL } from "@/lib/umbrella-tools/dev-tool-category-meta-tail";
import { getDevToolsLocaleFromCookie } from "@/lib/dev-tools-locale-server";
import { getDevToolsSeoMessages } from "@/lib/dev-tools-seo-messages";
import { getSiteUrl } from "@/lib/site-url";

/** Default OG/Twitter image (root layout uses metadataBase — path must be absolute on site). */
export const DEV_TOOLS_OG_IMAGE_PATH = "/opengraph-image";

const DEFAULT_SUFFIX = "Developer utilities";

export { DEV_TOOL_CATEGORY_META_TAIL } from "@/lib/umbrella-tools/dev-tool-category-meta-tail";

export function getDevToolMetaDescription(tool: UmbrellaTool): string {
  if (tool.seoDescription?.trim()) return tool.seoDescription.trim();
  const base = tool.description.trim();
  return `${base} ${DEV_TOOL_CATEGORY_META_TAIL[tool.category]}`;
}

/** Localized category tail for `<meta name="description">` when the dev-tools locale cookie is set. */
export function getDevToolMetaDescriptionForLocale(tool: UmbrellaTool, locale: DevToolsLocaleId): string {
  if (tool.seoDescription?.trim()) return tool.seoDescription.trim();
  const base = tool.description.trim();
  const seo = getDevToolsSeoMessages(locale);
  return `${base} ${seo.categoryMetaTail[tool.category]}`;
}

/**
 * Build Next.js metadata for umbrella / dev-tools pages (App Router).
 */
export async function umbrellaToolsMetadata(opts: {
  title: string;
  description: string;
  path: string;
  /** Optional SEO keywords (some search engines still use sparingly) */
  keywords?: string[];
  /** Open Graph / Twitter image path (defaults to site OG image). */
  ogImagePath?: string;
  /**
   * Middle segment before site name (default: "Developer utilities").
   * Localized via dev-tools SEO messages when the locale cookie is set.
   */
  titleSuffix?: string;
}): Promise<Metadata> {
  const [baseUrl, site] = await Promise.all([getSiteUrl(), readSiteContent()]);
  const path = opts.path.startsWith("/") ? opts.path : `/${opts.path}`;
  const url = `${baseUrl}${path}`;
  const suffix = opts.titleSuffix ?? DEFAULT_SUFFIX;
  /** Segment merged with root `layout` `titleTemplate` (e.g. `%s | Torq Studio`) — do not append site name here. */
  const titleSegment = `${opts.title} | ${suffix}`;
  const resolvedTitle = `${titleSegment} | ${site.siteName}`;
  const ogImage = opts.ogImagePath ?? DEV_TOOLS_OG_IMAGE_PATH;
  const ogAlt = `${opts.title} | ${site.siteName}`;
  return {
    title: titleSegment,
    description: opts.description,
    ...(opts.keywords?.length ? { keywords: opts.keywords } : {}),
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
    alternates: { canonical: url },
    openGraph: {
      title: resolvedTitle,
      description: opts.description,
      url,
      siteName: site.siteName,
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: ogAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: opts.description,
      images: [ogImage],
      ...(site.twitterSite ? { site: `@${site.twitterSite}`, creator: `@${site.twitterSite}` } : {}),
    },
  };
}

/**
 * Schema.org CollectionPage + ItemList for the /dev-tools hub (discovery + rich context).
 */
export function devToolsHubPageJsonLd(
  siteUrl: string,
  siteName: string,
  tools: UmbrellaTool[],
  locale: DevToolsLocaleId = "en",
) {
  const seo = getDevToolsSeoMessages(locale);
  const base = siteUrl.replace(/\/$/, "");
  const hubUrl = `${base}/dev-tools`;
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: seo.jsonLdHub.name,
    description: seo.jsonLdHub.description,
    url: hubUrl,
    isPartOf: {
      "@type": "WebSite",
      name: siteName,
      url: base,
    },
    mainEntity: {
      "@type": "ItemList",
      name: seo.jsonLdHub.itemListName,
      numberOfItems: tools.length,
      itemListElement: tools.map((t, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: t.title,
        description: t.description,
        url: `${base}/dev-tools/${t.slug}`,
      })),
    },
  };
}

/** @deprecated Use devToolsHubPageJsonLd — kept for any external imports */
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

/**
 * JSON-LD for individual tool URLs: WebPage + BreadcrumbList + WebApplication (free, client-side).
 */
export function devToolsToolPageJsonLd(opts: { siteUrl: string; siteName: string; tool: UmbrellaTool }) {
  const base = opts.siteUrl.replace(/\/$/, "");
  const pageUrl = `${base}/dev-tools/${opts.tool.slug}`;
  const name = opts.tool.seoTitle?.trim() || opts.tool.title;
  const desc = getDevToolMetaDescription(opts.tool);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name,
        description: desc,
        isPartOf: {
          "@type": "WebSite",
          "@id": `${base}#website`,
          name: opts.siteName,
          url: base,
        },
        breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
        about: { "@id": `${pageUrl}#webapp` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: base },
          { "@type": "ListItem", position: 2, name: "Developer tools", item: `${base}/dev-tools` },
          { "@type": "ListItem", position: 3, name: opts.tool.title, item: pageUrl },
        ],
      },
      {
        "@type": ["SoftwareApplication", "WebApplication"],
        "@id": `${pageUrl}#webapp`,
        name: opts.tool.title,
        description: desc,
        url: pageUrl,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Any",
        browserRequirements: "Requires JavaScript. Runs entirely in your browser; no install.",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
    ],
  };
}

/** Merges tool WebPage graph + optional FAQPage for rich results. */
export function devToolsToolFullJsonLd(opts: {
  siteUrl: string;
  siteName: string;
  tool: UmbrellaTool;
  slug: string;
  /** When omitted, uses registry/code FAQs from `getDevToolFaqItems`. Pass admin-driven pairs for structured FAQs. */
  faqSchemaPairs?: { question: string; answerPlain: string }[];
}) {
  const base = devToolsToolPageJsonLd(opts) as { "@context": string; "@graph": object[] };
  const pairs =
    opts.faqSchemaPairs !== undefined
      ? opts.faqSchemaPairs
      : getDevToolFaqItems(opts.slug).map((f) => ({ question: f.question, answerPlain: f.answer }));
  if (pairs.length === 0) return base;
  const baseUrl = opts.siteUrl.replace(/\/$/, "");
  const pageUrl = `${baseUrl}/dev-tools/${opts.slug}`;
  const faqPage = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    url: pageUrl,
    mainEntity: pairs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answerPlain,
      },
    })),
  };
  return {
    ...base,
    "@graph": [...base["@graph"], faqPage],
  };
}

export async function devToolsPageMetadata(slug: string): Promise<Metadata> {
  const adminDoc = await readDevToolsAdminDocument();
  const merged = getDevToolBySlugWithAdminSeo(slug, adminDoc);
  if (!merged) {
    return { title: "Developer tool", robots: { index: false, follow: false } };
  }
  const locale = await getDevToolsLocaleFromCookie();
  const seo = getDevToolsSeoMessages(locale);
  const title = merged.seoTitle?.trim() || merged.title;
  return umbrellaToolsMetadata({
    title,
    description: getDevToolMetaDescriptionForLocale(merged, locale),
    path: `/dev-tools/${slug}`,
    keywords: merged.keywords,
    ogImagePath: DEV_TOOLS_OG_IMAGE_PATH,
    titleSuffix: seo.titleSuffix,
  });
}

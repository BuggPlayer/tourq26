import type { Metadata } from "next";
import { readDevToolsAdminDocument, readSiteContent } from "@/lib/content";
import { getDevToolFaqItems } from "@/lib/umbrella-tools/dev-tool-faq";
import { getDevToolBySlugWithAdminSeo, isDevToolEnabled } from "@/lib/dev-tools-admin";
import type { UmbrellaTool } from "@/lib/umbrella-tools/tools-config";
import { DEV_TOOLS_LOCALE_OPTIONS, type DevToolsLocaleId } from "@/lib/dev-tools-locale";
import { getDevToolsHrefForLocale } from "@/lib/dev-tools-locale-path";
import { DEV_TOOL_CATEGORY_META_TAIL } from "@/lib/umbrella-tools/dev-tool-category-meta-tail";
import { getDevToolsLocaleFromCookie } from "@/lib/dev-tools-locale-server";
import { getDevToolsMessages } from "@/lib/dev-tools-messages";
import { getDevToolsSeoMessages } from "@/lib/dev-tools-seo-messages";
import { getSiteUrl } from "@/lib/site-url";
import { resolveDevToolPageStructure, type DevToolHowToStep } from "@/lib/umbrella-tools/dev-tool-page-structure";

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

/** BCP-47 keys for `alternates.languages` (hreflang) + self canonical for the active locale. */
export function buildDevToolsHreflangAlternates(
  baseUrl: string,
  pathSuffix: string,
  currentLocale: DevToolsLocaleId,
): { canonical: string; languages: Record<string, string> } {
  const base = baseUrl.replace(/\/$/, "");
  const languages: Record<string, string> = {};
  for (const opt of DEV_TOOLS_LOCALE_OPTIONS) {
    const href = `${base}${getDevToolsHrefForLocale(pathSuffix, opt.id)}`;
    languages[opt.htmlLang] = href;
  }
  languages["x-default"] = `${base}${getDevToolsHrefForLocale(pathSuffix, "en")}`;
  const canonical = `${base}${getDevToolsHrefForLocale(pathSuffix, currentLocale)}`;
  return { canonical, languages };
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
  /** When set, adds hreflang alternates + locale-appropriate canonical (path must be canonical `/dev-tools…` suffix). */
  hreflang?: { pathSuffix: string; locale: DevToolsLocaleId };
}): Promise<Metadata> {
  const [baseUrl, site] = await Promise.all([getSiteUrl(), readSiteContent()]);
  const path = opts.path.startsWith("/") ? opts.path : `/${opts.path}`;
  const url = `${baseUrl}${path}`;
  const href = opts.hreflang
    ? buildDevToolsHreflangAlternates(baseUrl, opts.hreflang.pathSuffix, opts.hreflang.locale)
    : null;
  const canonicalUrl = href?.canonical ?? url;
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
    alternates: href
      ? { canonical: canonicalUrl, languages: href.languages }
      : { canonical: url },
    openGraph: {
      title: resolvedTitle,
      description: opts.description,
      url: canonicalUrl,
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
  const hubUrl = `${base}${getDevToolsHrefForLocale("/dev-tools", locale)}`;
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
        url: `${base}${getDevToolsHrefForLocale(`/dev-tools/${t.slug}`, locale)}`,
      })),
    },
    inLanguage: locale,
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
 * JSON-LD for individual tool URLs: WebPage + BreadcrumbList + SoftwareApplication.
 * Rich-result validators may expect `aggregateRating` or `review` for app-like types; we omit fabricated ratings.
 */
export function devToolsToolPageJsonLd(opts: {
  siteUrl: string;
  siteName: string;
  tool: UmbrellaTool;
  /** Page locale for breadcrumb labels and absolute URLs. */
  locale?: DevToolsLocaleId;
}) {
  const locale = opts.locale ?? "en";
  const base = opts.siteUrl.replace(/\/$/, "");
  const pageUrl = `${base}${getDevToolsHrefForLocale(`/dev-tools/${opts.tool.slug}`, locale)}`;
  const name = opts.tool.seoTitle?.trim() || opts.tool.title;
  const desc = getDevToolMetaDescriptionForLocale(opts.tool, locale);
  const messages = getDevToolsMessages(locale);
  const devToolsHubHref = `${base}${getDevToolsHrefForLocale("/dev-tools", locale)}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name,
        description: desc,
        inLanguage: locale,
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
          { "@type": "ListItem", position: 1, name: messages.breadcrumbs.home, item: base },
          { "@type": "ListItem", position: 2, name: messages.breadcrumbs.devTools, item: devToolsHubHref },
          { "@type": "ListItem", position: 3, name: opts.tool.title, item: pageUrl },
        ],
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${pageUrl}#webapp`,
        name: opts.tool.title,
        description: desc,
        url: pageUrl,
        inLanguage: locale,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Web browser",
        browserRequirements: "Requires JavaScript. Runs entirely in your browser; no install.",
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        ...(opts.tool.keywords?.length ? { keywords: opts.tool.keywords.join(", ") } : {}),
      },
    ],
  };
}

/** Merges tool WebPage graph + HowTo + optional FAQPage for rich results. */
export function devToolsToolFullJsonLd(opts: {
  siteUrl: string;
  siteName: string;
  tool: UmbrellaTool;
  slug: string;
  locale?: DevToolsLocaleId;
  /** When omitted, uses registry/code FAQs from `getDevToolFaqItems`. Pass admin-driven pairs for structured FAQs. */
  faqSchemaPairs?: { question: string; answerPlain: string }[];
  /** Overrides HowTo steps in JSON-LD; defaults match on-page “How to use” from `resolveDevToolPageStructure`. */
  howToSteps?: DevToolHowToStep[];
}) {
  const locale = opts.locale ?? "en";
  const base = devToolsToolPageJsonLd({ ...opts, locale }) as { "@context": string; "@graph": object[] };
  const pairs =
    opts.faqSchemaPairs !== undefined
      ? opts.faqSchemaPairs
      : getDevToolFaqItems(opts.slug).map((f) => ({ question: f.question, answerPlain: f.answer }));

  const baseUrl = opts.siteUrl.replace(/\/$/, "");
  const pageUrl = `${baseUrl}${getDevToolsHrefForLocale(`/dev-tools/${opts.slug}`, locale)}`;
  const desc = getDevToolMetaDescriptionForLocale(opts.tool, locale);

  const howToSteps =
    opts.howToSteps?.length && opts.howToSteps.length >= 2
      ? opts.howToSteps
      : resolveDevToolPageStructure(opts.tool).howToSteps;

  const howToPage = {
    "@type": "HowTo",
    "@id": `${pageUrl}#howto`,
    name: `How to use ${opts.tool.title}`,
    description: desc,
    totalTime: "PT1M",
    step: howToSteps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };

  const graph = [...base["@graph"], howToPage];

  if (pairs.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${pageUrl}#faq`,
      url: pageUrl,
      inLanguage: locale,
      mainEntity: pairs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: f.answerPlain,
        },
      })),
    });
  }

  return {
    ...base,
    "@graph": graph,
  };
}

export async function devToolsPageMetadata(
  slug: string,
  localeOverride?: DevToolsLocaleId,
): Promise<Metadata> {
  const adminDoc = await readDevToolsAdminDocument();
  const merged = getDevToolBySlugWithAdminSeo(slug, adminDoc);
  if (!merged) {
    return { title: "Developer tool", robots: { index: false, follow: false } };
  }
  if (!isDevToolEnabled(slug, adminDoc)) {
    return { title: "Developer tool", robots: { index: false, follow: false } };
  }
  const locale = localeOverride ?? (await getDevToolsLocaleFromCookie());
  const seo = getDevToolsSeoMessages(locale);
  const title = merged.seoTitle?.trim() || merged.title;
  const pathSuffix = `/dev-tools/${slug}`;
  return umbrellaToolsMetadata({
    title,
    description: getDevToolMetaDescriptionForLocale(merged, locale),
    path: getDevToolsHrefForLocale(pathSuffix, locale),
    keywords: merged.keywords,
    ogImagePath: DEV_TOOLS_OG_IMAGE_PATH,
    titleSuffix: seo.titleSuffix,
    hreflang: { pathSuffix, locale },
  });
}

/** Hub index metadata with hreflang (canonical `/dev-tools` for `en`, prefixed for other locales). */
export async function devToolsHubIndexMetadata(locale: DevToolsLocaleId): Promise<Metadata> {
  const seo = getDevToolsSeoMessages(locale);
  return umbrellaToolsMetadata({
    title: seo.hub.title,
    description: seo.hub.description,
    path: getDevToolsHrefForLocale("/dev-tools", locale),
    keywords: seo.hub.keywords,
    ogImagePath: DEV_TOOLS_OG_IMAGE_PATH,
    titleSuffix: seo.titleSuffix,
    hreflang: { pathSuffix: "/dev-tools", locale },
  });
}

export async function devToolsAboutMetadata(locale: DevToolsLocaleId): Promise<Metadata> {
  const seo = getDevToolsSeoMessages(locale);
  return umbrellaToolsMetadata({
    title: seo.about.title,
    description: seo.about.description,
    path: getDevToolsHrefForLocale("/dev-tools/about", locale),
    ogImagePath: DEV_TOOLS_OG_IMAGE_PATH,
    titleSuffix: seo.titleSuffix,
    hreflang: { pathSuffix: "/dev-tools/about", locale },
  });
}

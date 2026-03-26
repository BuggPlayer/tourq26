import type { Metadata } from "next";
import { readSiteContent } from "@/lib/content";
import { getDevToolFaqItems } from "@/lib/umbrella-tools/dev-tool-faq";
import { getDevToolBySlug, type UmbrellaTool } from "@/lib/umbrella-tools/tools-config";
import type { DevToolCategory } from "@/lib/umbrella-tools/types";
import { getSiteUrl } from "@/lib/site-url";

/** Default OG/Twitter image (root layout uses metadataBase — path must be absolute on site). */
export const DEV_TOOLS_OG_IMAGE_PATH = "/opengraph-image";

const DEFAULT_SUFFIX = "Developer utilities";

/** Appended when `seoDescription` is absent — varies by category to reduce duplicate meta text. */
const CATEGORY_META_TAIL: Record<DevToolCategory, string> = {
  text: "Free online text utility — runs in your browser, no signup.",
  url: "Free URL tool — client-side only; nothing uploaded to our servers.",
  html: "Free HTML utility — processed locally in your browser.",
  markdown: "Free Markdown utility — runs client-side in your browser.",
  css: "Free CSS developer tool — works locally in your browser.",
  javascript: "Free JavaScript utility — client-side, no server round-trip.",
  json: "Free JSON tool — your data stays in the browser tab.",
  xml: "Free XML utility — parse and convert locally, no upload.",
  yaml: "Free YAML tool — runs in your browser; no account required.",
  csv: "Free CSV / tabular data utility — client-side processing.",
  php: "Free PHP helper — runs in your browser for quick conversions.",
  database: "Free database utility — connection strings parsed locally in your browser.",
  randomizers: "Free randomizer — cryptographically strong where supported; runs locally.",
  base32: "Free Base32 tool — encode and decode in your browser.",
  base58: "Free Base58 tool — runs locally; no data sent to our servers.",
  base64: "Free Base64 tool — UTF-8 safe; processed entirely client-side.",
  hash: "Free hash generator — digests computed in your browser only.",
  hmac: "Free HMAC tool — keyed hashes for debugging; stays in this tab.",
  bcrypt: "Free bcrypt utility — passwords never leave your browser.",
  qrcode: "Free QR tool — generated or decoded locally in your browser.",
  network: "Free network calculator — IPv4 and IP info without server-side storage.",
  checksum: "Free checksum utility — integrity checks over UTF-8 in your browser.",
  pastebin: "Free pastebin — optional share links; content stays client-side or in the URL.",
};

export function getDevToolMetaDescription(tool: UmbrellaTool): string {
  if (tool.seoDescription?.trim()) return tool.seoDescription.trim();
  const base = tool.description.trim();
  return `${base} ${CATEGORY_META_TAIL[tool.category]}`;
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
}): Promise<Metadata> {
  const [baseUrl, site] = await Promise.all([getSiteUrl(), readSiteContent()]);
  const path = opts.path.startsWith("/") ? opts.path : `/${opts.path}`;
  const url = `${baseUrl}${path}`;
  const pageTitle = `${opts.title} | ${DEFAULT_SUFFIX} | ${site.siteName}`;
  const ogImage = opts.ogImagePath ?? DEV_TOOLS_OG_IMAGE_PATH;
  const ogAlt = `${opts.title} | ${site.siteName}`;
  return {
    title: pageTitle,
    description: opts.description,
    ...(opts.keywords?.length ? { keywords: opts.keywords } : {}),
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
    alternates: { canonical: url },
    openGraph: {
      title: pageTitle,
      description: opts.description,
      url,
      siteName: site.siteName,
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: ogAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: opts.description,
      images: [ogImage],
      ...(site.twitterSite ? { site: `@${site.twitterSite}`, creator: `@${site.twitterSite}` } : {}),
    },
  };
}

/**
 * Schema.org CollectionPage + ItemList for the /dev-tools hub (discovery + rich context).
 */
export function devToolsHubPageJsonLd(siteUrl: string, siteName: string, tools: UmbrellaTool[]) {
  const base = siteUrl.replace(/\/$/, "");
  const hubUrl = `${base}/dev-tools`;
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Free online developer tools",
    description:
      "Browse free developer utilities: JSON, Base64, hashing, QR codes, CIDR, encodings, and more. All tools run client-side in your browser — no account required.",
    url: hubUrl,
    isPartOf: {
      "@type": "WebSite",
      name: siteName,
      url: base,
    },
    mainEntity: {
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
  const tool = getDevToolBySlug(slug);
  if (!tool) {
    return { title: "Developer tool", robots: { index: false, follow: false } };
  }
  const title = tool.seoTitle?.trim() || tool.title;
  return umbrellaToolsMetadata({
    title,
    description: getDevToolMetaDescription(tool),
    path: `/dev-tools/${slug}`,
    keywords: tool.keywords,
    ogImagePath: DEV_TOOLS_OG_IMAGE_PATH,
  });
}

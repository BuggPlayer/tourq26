import type { Metadata } from "next";
import Link from "next/link";
import MarketingHeader from "@/components/MarketingHeader";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { techNewsDemoItems } from "@/data/tech-news-demo";
import { getSiteUrl } from "@/lib/site-url";
import { readSiteContent } from "@/lib/content";
import { breadcrumbListJsonLd, techNewsCollectionJsonLd, webPageJsonLd } from "@/lib/seo";

const PAGE_PATH = "/tech-news";

export async function generateMetadata(): Promise<Metadata> {
  const [baseUrl, site] = await Promise.all([getSiteUrl(), readSiteContent()]);
  const title = "Tech News";
  const description =
    "Curated technology news on AI, cloud, security, hardware, developer tools, and startups—briefings for builders and product leaders. Updated regularly.";
  const canonical = `${baseUrl}${PAGE_PATH}`;
  const ogTitle = `Tech News | ${site.siteName}`;
  return {
    title,
    description,
    keywords: [
      "technology news",
      "AI news",
      "software engineering",
      "cloud computing",
      "cybersecurity",
      "developer tools",
      "startup news",
      site.siteName,
    ],
    alternates: { canonical },
    openGraph: {
      title: ogTitle,
      description,
      url: canonical,
      type: "website",
      siteName: site.siteName,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
    },
    robots: { index: true, follow: true },
  };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function TechNewsPage() {
  const [siteUrl, site] = await Promise.all([getSiteUrl(), readSiteContent()]);
  const pageName = `Tech News | ${site.siteName}`;
  const pageDescription =
    "Technology news and analysis for developers, founders, and engineering leaders—AI, cloud, security, and more.";

  const breadcrumbLd = breadcrumbListJsonLd(siteUrl, [
    { name: "Home", path: "/" },
    { name: "Tech News", path: PAGE_PATH },
  ]);

  const webPageLd = webPageJsonLd({
    siteUrl,
    path: PAGE_PATH,
    name: pageName,
    description: pageDescription,
  });

  const collectionLd = techNewsCollectionJsonLd({
    siteUrl,
    siteName: site.siteName,
    pageName,
    pageDescription,
    articles: techNewsDemoItems.map((item) => ({
      headline: item.title,
      description: item.excerpt,
      datePublished: `${item.datePublished}T00:00:00.000Z`,
      articleSection: item.category,
      url: `${siteUrl}/tech-news/${item.slug}`,
    })),
  });

  const [featured, ...rest] = techNewsDemoItems;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={webPageLd} />
      <JsonLd data={collectionLd} />
      <MarketingHeader />
      <main>
        <section className="gradient-mesh relative border-b border-[var(--color-border)]/50 px-4 pt-32 pb-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-[var(--color-primary)]">
              Technology briefing
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
              Tech news
            </h1>
            <p className="mt-6 text-lg text-[var(--color-muted)] leading-relaxed">
              Signal over noise: what matters for builders, product teams, and leaders shipping software. Full articles
              open on dedicated URLs for sharing and SEO.
            </p>
          </div>
        </section>

        <section
          aria-labelledby="featured-heading"
          className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8"
        >
          <h2 id="featured-heading" className="sr-only">
            Featured story
          </h2>
          <Link
            href={`/tech-news/${featured.slug}`}
            className="card-hover block overflow-hidden rounded-2xl border border-[var(--color-border)]/60 bg-[var(--surface)] shadow-[0_0_0_1px_rgba(255,255,255,0.03)] transition-colors hover:border-[var(--color-primary)]/30"
          >
            <div className="grid gap-0 lg:grid-cols-5">
              <div className="relative min-h-[220px] bg-gradient-to-br from-[var(--color-primary)]/30 via-[var(--surface)] to-[var(--background)] lg:col-span-2">
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <span className="font-display text-6xl font-bold text-white/10">01</span>
                </div>
              </div>
              <div className="p-8 lg:col-span-3">
                <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--color-muted)]">
                  <span className="rounded-full border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 px-3 py-0.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-primary)]">
                    {featured.category}
                  </span>
                  <time dateTime={featured.datePublished}>{formatDate(featured.datePublished)}</time>
                  <span aria-hidden>·</span>
                  <span>{featured.readingTimeMinutes} min read</span>
                </div>
                <h3 className="mt-4 font-display text-2xl font-bold leading-snug text-white sm:text-3xl">
                  {featured.title}
                </h3>
                <p className="mt-2 text-[var(--color-primary)]/90 font-medium">{featured.dek}</p>
                <p className="mt-4 text-[var(--color-muted)] leading-relaxed">{featured.excerpt}</p>
                <span className="mt-4 inline-block text-sm font-medium text-[var(--color-primary)]">
                  Read full article →
                </span>
              </div>
            </div>
          </Link>
        </section>

        <section
          aria-labelledby="latest-heading"
          className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8"
        >
          <div className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="latest-heading" className="font-display text-2xl font-bold text-white sm:text-3xl">
                Latest
              </h2>
              <p className="mt-1 text-sm text-[var(--color-muted)]">
                Each headline links to a full article page with canonical URL and structured data.
              </p>
            </div>
          </div>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/tech-news/${item.slug}`}
                  className="card-hover flex h-full flex-col rounded-2xl border border-[var(--color-border)]/50 bg-[var(--surface)] p-6 transition-colors hover:border-[var(--color-primary)]/30"
                >
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--color-muted)]">
                    <span className="font-semibold text-[var(--color-primary)]">{item.category}</span>
                    <span aria-hidden>·</span>
                    <time dateTime={item.datePublished}>{formatDate(item.datePublished)}</time>
                  </div>
                  <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--color-primary)]/90">{item.dek}</p>
                  <p className="mt-3 flex-1 text-sm text-[var(--color-muted)] leading-relaxed">
                    {item.excerpt}
                  </p>
                  <p className="mt-4 text-xs text-[var(--color-muted)]">{item.readingTimeMinutes} min read</p>
                  <span className="mt-3 text-sm font-medium text-[var(--color-primary)]">Read article →</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
}

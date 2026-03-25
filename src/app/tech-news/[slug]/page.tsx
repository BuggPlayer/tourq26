import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import MarketingHeader from "@/components/MarketingHeader";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { getTechNewsBySlug, getAllTechNewsSlugs } from "@/data/tech-news-demo";
import { getSiteUrl } from "@/lib/site-url";
import { readSiteContent } from "@/lib/content";
import { breadcrumbListJsonLd, techNewsArticleJsonLd } from "@/lib/seo";

/** Only slugs from the content module resolve; unknown URLs 404 (no accidental SSR). */
export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllTechNewsSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getTechNewsBySlug(slug);
  const site = await readSiteContent();
  if (!article) return { title: "Article not found", robots: { index: false, follow: false } };
  const baseUrl = site.siteUrl.replace(/\/$/, "");
  const canonical = `${baseUrl}/tech-news/${article.slug}`;
  const ogImage = `/tech-news/${article.slug}/opengraph-image`;
  const title = article.title;
  const description = article.excerpt;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${title} | ${site.siteName}`,
      description,
      url: canonical,
      type: "article",
      publishedTime: `${article.datePublished}T00:00:00.000Z`,
      siteName: site.siteName,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${site.siteName}`,
      description,
      images: [ogImage],
      ...(site.twitterSite
        ? { site: `@${site.twitterSite}`, creator: `@${site.twitterSite}` }
        : {}),
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

export default async function TechNewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getTechNewsBySlug(slug);
  if (!article) notFound();

  const [site, siteUrl] = await Promise.all([readSiteContent(), getSiteUrl()]);
  const isoPublished = `${article.datePublished}T00:00:00.000Z`;
  const articleBodyText = article.paragraphs.join("\n\n");

  const newsLd = techNewsArticleJsonLd({
    siteUrl,
    slug: article.slug,
    headline: article.title,
    description: article.excerpt,
    datePublished: isoPublished,
    articleSection: article.category,
    siteName: site.siteName,
    articleBody: articleBodyText,
  });

  const breadcrumbLd = breadcrumbListJsonLd(siteUrl, [
    { name: "Home", path: "/" },
    { name: "Tech News", path: "/tech-news" },
    { name: article.title, path: `/tech-news/${article.slug}` },
  ]);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <JsonLd data={newsLd} />
      <JsonLd data={breadcrumbLd} />
      <MarketingHeader />
      <main>
        <article className="mx-auto max-w-3xl px-4 pt-32 pb-20 sm:px-6 lg:px-8">
          <Link
            href="/tech-news"
            className="text-sm text-[var(--color-muted)] hover:text-[var(--color-primary)]"
          >
            ← Tech news
          </Link>
          <header className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-primary)]">
              {article.category}
            </p>
            <time className="mt-2 block text-sm text-[var(--color-muted)]" dateTime={article.datePublished}>
              {formatDate(article.datePublished)} · {article.readingTimeMinutes} min read
            </time>
            <h1 className="mt-4 font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
              {article.title}
            </h1>
            <p className="mt-4 text-lg font-medium text-[var(--color-primary)]/95 leading-relaxed">
              {article.dek}
            </p>
            <p className="mt-4 text-lg text-[var(--color-muted)] leading-relaxed">{article.excerpt}</p>
          </header>
          <div className="prose prose-invert mt-10 max-w-none [&_p]:text-[var(--color-muted)] [&_p]:leading-relaxed [&_p]:text-[1.05rem]">
            {article.paragraphs.map((p, i) => (
              <p key={i} className="mb-6 last:mb-0">
                {p}
              </p>
            ))}
          </div>
          <div className="mt-14 border-t border-[var(--color-border)]/50 pt-8">
            <Link
              href="/tech-news"
              className="text-sm font-medium text-[var(--color-primary)] hover:underline"
            >
              More tech news →
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import MarketingHeader from "@/components/MarketingHeader";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { caseStudies, getCaseStudyBySlug } from "@/data/case-studies";
import { readSiteContent } from "@/lib/content";
import { getSiteUrl } from "@/lib/site-url";
import { breadcrumbListJsonLd, caseStudyArticleJsonLd } from "@/lib/seo";
import { SupportingProseSection } from "@/components/marketing/SupportingProseSection";

export async function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);
  if (!study) return { title: "Case study not found", robots: { index: false, follow: false } };
  const site = await readSiteContent();
  const metaTitle = study.seoTitle?.trim() || study.title;
  const baseUrl = site.siteUrl.replace(/\/$/, "");
  const ogImage = `/case-studies/${study.slug}/opengraph-image`;
  return {
    title: metaTitle,
    description: study.description,
    alternates: { canonical: `${baseUrl}/case-studies/${study.slug}` },
    openGraph: {
      title: `${metaTitle} | Torq Studio`,
      description: study.description,
      url: `${baseUrl}/case-studies/${study.slug}`,
      type: "article",
      publishedTime: study.date,
      images: [{ url: ogImage, width: 1200, height: 630, alt: metaTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: study.description,
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

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);
  if (!study) notFound();

  const [site, siteUrl] = await Promise.all([readSiteContent(), getSiteUrl()]);
  const articleLd = caseStudyArticleJsonLd({
    siteUrl,
    slug: study.slug,
    headline: study.title,
    description: study.description,
    datePublished: study.date,
    siteName: site.siteName,
  });
  const breadcrumbLd = breadcrumbListJsonLd(siteUrl, [
    { name: "Home", path: "/" },
    { name: "Case studies", path: "/case-studies" },
    { name: study.title, path: `/case-studies/${study.slug}` },
  ]);

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={articleLd} />
      <JsonLd data={breadcrumbLd} />
      <MarketingHeader />
      <main>
        <article className="mx-auto max-w-3xl px-4 pt-32 pb-20 sm:px-6 lg:px-8">
          <Link
            href="/case-studies"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            ← All case studies
          </Link>
          <div className="relative mt-6 overflow-hidden rounded-2xl border border-border/50 bg-surface ring-1 ring-foreground/5">
            <div className="relative aspect-[2/1] w-full min-h-[200px] sm:min-h-[260px]">
              <Image
                src={study.coverImage}
                alt={study.coverAlt}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 720px"
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"
                aria-hidden
              />
            </div>
          </div>
          <header className="mt-8">
            <p className="text-xs font-medium uppercase tracking-wider text-primary">
              {study.industry} · {study.client}
            </p>
            <time className="mt-2 block text-sm text-muted-foreground" dateTime={study.date}>
              {formatDate(study.date)} · {study.readTime}
            </time>
            <h1 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">
              {study.title}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">{study.description}</p>
            <div className="mt-6 rounded-xl border border-border/40 bg-surface p-5">
              <p className="text-sm font-semibold text-foreground">Challenge</p>
              <p className="mt-1 text-sm text-muted-foreground">{study.challenge}</p>
              <p className="mt-4 text-sm font-semibold text-primary">Outcome</p>
              <p className="mt-1 text-sm text-foreground">{study.outcome}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {study.services.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-primary-muted px-3 py-1 text-xs font-medium text-primary"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </header>
          <div
            className="prose prose-invert mt-10 max-w-none [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mt-10 [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_ul]:text-muted-foreground [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mt-1 [&_strong]:text-foreground/95"
            dangerouslySetInnerHTML={{ __html: study.body }}
          />

          <SupportingProseSection
            id="case-study-related-help"
            className="mt-12"
            heading="Planning something similar?"
            paragraphs={[
              `This overview reflects delivery patterns we use with teams in ${study.industry.toLowerCase()} and adjacent sectors—balancing speed, risk, and maintainability. Names and figures are adjusted where needed, but the engineering and collaboration lessons are representative of how we work.`,
              "If you are comparing partners for mobile, web, AI, or API work, start with the relevant service page for scope models and FAQs, then use the contact form to share constraints. We will suggest a proportionate next step rather than a one-size-fits-all proposal.",
            ]}
          />

          <div className="mt-14 flex flex-col gap-4 border-t border-border/40 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/contact"
              className="inline-flex justify-center rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
            >
              Discuss a similar project
            </Link>
            <Link
              href="/services"
              className="text-center text-sm text-muted-foreground hover:text-primary sm:text-right"
            >
              Explore services →
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import MarketingHeader from "@/components/MarketingHeader";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { caseStudies } from "@/data/case-studies";
import { getSiteUrl } from "@/lib/site-url";
import { breadcrumbListJsonLd, webPageJsonLd } from "@/lib/seo";
import { readSiteContent } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = await getSiteUrl();
  return {
    title: "Case studies",
    description:
      "How Torq Studio delivers mobile apps, web platforms, AI solutions, and remote engineering teams—real outcomes across fintech, logistics, e-commerce, and B2B SaaS.",
    alternates: { canonical: `${baseUrl}/case-studies` },
    openGraph: {
      title: "Case studies | Torq Studio",
      description:
        "Deep dives into delivery: architecture, AI in support, platform rebuilds, and API modernisation.",
      url: `${baseUrl}/case-studies`,
    },
    robots: { index: true, follow: true },
  };
}

export default async function CaseStudiesIndexPage() {
  const [siteUrl, site] = await Promise.all([getSiteUrl(), readSiteContent()]);
  const breadcrumbLd = breadcrumbListJsonLd(siteUrl, [
    { name: "Home", path: "/" },
    { name: "Case studies", path: "/case-studies" },
  ]);
  const webLd = webPageJsonLd({
    siteUrl,
    path: "/case-studies",
    name: "Case studies | Torq Studio",
    description:
      "How we deliver outcomes for fintech, logistics, e-commerce, and B2B SaaS clients worldwide.",
  });

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={webLd} />
      <MarketingHeader />
      <main>
        <section className="gradient-mesh relative border-b border-[var(--color-border)]/40 px-4 pt-32 pb-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-[var(--color-primary)]">
              Proof in practice
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
              Case studies
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-[var(--color-muted)]">
              Industry-level write-ups: context, approach, and outcomes. Names anonymised where required;
              patterns and metrics reflect how we work with product and engineering leaders.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            {caseStudies.map((study) => (
              <article
                key={study.slug}
                className="card-hover flex flex-col overflow-hidden rounded-2xl border border-[var(--color-border)]/40 bg-[var(--surface)]"
              >
                <div className="relative h-48 overflow-hidden sm:h-52">
                  <Image
                    src={study.coverImage}
                    alt={study.coverAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--surface)]/90 via-transparent to-transparent"
                    aria-hidden
                  />
                </div>
                <div className="flex flex-1 flex-col p-6 sm:p-8">
                  <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-primary)]">
                    {study.industry}
                  </p>
                  <h2 className="mt-2 font-display text-xl font-semibold text-white sm:text-2xl">
                    {study.title}
                  </h2>
                  <p className="mt-3 text-sm text-[var(--color-muted)] leading-relaxed">
                    {study.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {study.services.map((s) => (
                      <span
                        key={s}
                        className="rounded-full bg-[var(--color-surface-elevated)] px-3 py-1 text-xs text-[var(--color-muted)] ring-1 ring-[var(--color-border)]/40"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="mt-6 flex items-center gap-3 border-t border-[var(--color-border)]/40 pt-6">
                    <span className="stat-number rounded-full px-4 py-2 text-sm font-bold bg-[var(--color-primary-muted)]">
                      {study.metric}
                    </span>
                    <span className="text-xs text-[var(--color-muted)]">{study.metricLabel}</span>
                  </div>
                  <Link
                    href={`/case-studies/${study.slug}`}
                    className="mt-6 inline-flex text-sm font-semibold text-[var(--color-primary)] hover:underline"
                  >
                    Read full case study →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

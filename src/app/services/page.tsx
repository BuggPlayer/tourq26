import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import MarketingHeader from "@/components/MarketingHeader";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { servicePages } from "@/data/services-content";
import { getSiteUrl } from "@/lib/site-url";
import { breadcrumbListJsonLd, webPageJsonLd } from "@/lib/seo";
import { SupportingProseSection } from "@/components/marketing/SupportingProseSection";
const iconMap: Record<string, string> = {
  "mobile-app-development": "/images/icons/mobile.svg",
  "web-development": "/images/icons/web.svg",
  "ai-solutions": "/images/icons/ai.svg",
  "remote-it": "/images/icons/team.svg",
  "technical-consulting": "/images/icons/web.svg",
};

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = await getSiteUrl();
  return {
    title: "Services",
    description:
      "Mobile apps, websites and web APIs, AI, remote engineering, and technical consulting—how senior Torq Studio engineers deliver and advise.",
    alternates: { canonical: `${baseUrl}/services` },
    openGraph: {
      title: "Services | Torq Studio",
      description:
        "Industry-grade delivery across mobile, web, AI, and embedded engineering teams.",
      url: `${baseUrl}/services`,
    },
    robots: { index: true, follow: true },
  };
}

export default async function ServicesIndexPage() {
  const siteUrl = await getSiteUrl();
  const breadcrumbLd = breadcrumbListJsonLd(siteUrl, [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
  ]);
  const webLd = webPageJsonLd({
    siteUrl,
    path: "/services",
    name: "Services | Torq Studio",
    description:
      "Mobile, web, AI, and remote IT—structured delivery, clear ownership, and measurable outcomes.",
  });

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={webLd} />
      <MarketingHeader />
      <main>
        <section className="gradient-mesh relative border-b border-border/40 px-4 pt-32 pb-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-primary">
              What we deliver
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl">
              What we build &amp; advise on
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Senior software engineers offering delivery and consulting. Each page covers how we work, what
              “good” looks like, and FAQs founders and engineering leads actually ask.
            </p>
          </div>
        </section>

        <SupportingProseSection
          id="services-how-to-choose"
          heading="Choosing the right engagement"
          paragraphs={[
            "Each service page explains how Torq Studio delivers outcomes—not just a feature list. You will find typical engagement shapes (MVP, retainer, advisory), what good looks like for that discipline, and FAQs drawn from real client conversations.",
            "Mobile and web delivery pages cover store submission, performance, SEO-adjacent concerns for marketing sites, and API stability for partner integrations. AI and automation pages emphasise evaluation, logging, and human review rather than one-off demos. Remote IT and consulting pages describe how embedded squads and short advisory blocks differ from traditional staff aug.",
            "If you are unsure where to start, contact us with your constraints. We will recommend a sensible first step—often a short discovery or architecture review—before proposing a long build contract.",
          ]}
        />

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            {servicePages.map((p) => (
              <Link
                key={p.slug}
                href={`/services/${p.slug}`}
                className="card-hover group flex flex-col rounded-2xl border border-border/40 bg-surface p-8 transition-colors hover:border-primary/30"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/15 text-primary">
                  <Image
                    src={iconMap[p.slug] ?? "/images/icons/web.svg"}
                    alt={`${p.title} service icon`}
                    width={28}
                    height={28}
                    className="opacity-90"
                    unoptimized
                  />
                </span>
                <h2 className="mt-5 font-display text-xl font-semibold text-foreground sm:text-2xl group-hover:text-primary">
                  {p.title}
                </h2>
                <p className="mt-3 flex-1 text-sm text-muted-foreground leading-relaxed">{p.description}</p>
                <span className="mt-6 text-sm font-semibold text-primary">
                  Read service overview →
                </span>
              </Link>
            ))}
          </div>
        </section>

        <SupportingProseSection
          id="services-after-cards"
          heading="From first conversation to production"
          paragraphs={[
            "Every service line on this page links to a deeper overview: typical timelines, tooling, testing expectations, and questions buyers forget to ask until late in procurement. We encourage you to read the FAQ blocks—they reflect real objections and edge cases from past engagements.",
            "Mobile and web pages describe how we handle design handoffs, accessibility, performance budgets, and release governance. AI pages stress evaluation datasets, monitoring, and rollback. Remote IT and consulting pages explain squad composition, communication rhythms, and how we measure velocity without gaming story points.",
            "When you are ready to compare Torq Studio with other options, combine these overviews with our case studies and blog. Then use the contact form with a short problem statement—we will reply with a suggested workshop, estimate range, or referral if another partner is a better match.",
          ]}
        />
      </main>
      <Footer />
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import MarketingHeader from "@/components/MarketingHeader";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { caseStudies } from "@/data/case-studies";
import { getSiteUrl } from "@/lib/site-url";
import { breadcrumbListJsonLd, webPageJsonLd } from "@/lib/seo";
import { SupportingProseSection } from "@/components/marketing/SupportingProseSection";

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
  const siteUrl = await getSiteUrl();
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
    <div className="min-h-screen bg-background">
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={webLd} />
      <MarketingHeader />
      <main>
        <section className="gradient-mesh relative border-b border-border/40 px-4 pt-32 pb-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-primary">
              Proof in practice
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl">
              Case studies
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Industry-level write-ups: context, approach, and outcomes. Names anonymised where required;
              patterns and metrics reflect how we work with product and engineering leaders.
            </p>
          </div>
        </section>

        <SupportingProseSection
          id="case-studies-method"
          heading="How we document client work"
          paragraphs={[
            "These case studies describe real delivery patterns—architecture choices, team shape, and outcomes—while respecting confidentiality. You will see anonymised industries and composite timelines where needed, but the technical and organisational lessons are faithful to how we operate.",
            "We work with fintech, logistics, e-commerce, B2B SaaS, and other regulated or high-scale environments. Common threads include shipping production mobile apps, rebuilding web platforms, introducing AI-assisted support without losing human oversight, and modernising APIs without breaking long-tail integrations.",
            "If a story resonates with your roadmap, start from the services overview or book a consultation. We are happy to map a similar engagement model to your constraints, risk tolerance, and internal skills.",
          ]}
        />

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            {caseStudies.map((study) => (
              <article
                key={study.slug}
                className="card-hover flex flex-col overflow-hidden rounded-2xl border border-border/40 bg-surface"
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
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface/90 via-transparent to-transparent"
                    aria-hidden
                  />
                </div>
                <div className="flex flex-1 flex-col p-6 sm:p-8">
                  <p className="text-xs font-medium uppercase tracking-wider text-primary">
                    {study.industry}
                  </p>
                  <h2 className="mt-2 font-display text-xl font-semibold text-foreground sm:text-2xl">
                    {study.title}
                  </h2>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {study.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {study.services.map((s) => (
                      <span
                        key={s}
                        className="rounded-full bg-surface-elevated px-3 py-1 text-xs text-muted-foreground ring-1 ring-border/40"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="mt-6 flex items-center gap-3 border-t border-border/40 pt-6">
                    <span className="stat-number rounded-full px-4 py-2 text-sm font-bold bg-primary-muted">
                      {study.metric}
                    </span>
                    <span className="text-xs text-muted-foreground">{study.metricLabel}</span>
                  </div>
                  <Link
                    href={`/case-studies/${study.slug}`}
                    className="mt-6 inline-flex text-sm font-semibold text-primary hover:underline"
                  >
                    Read full case study →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <SupportingProseSection
          id="case-studies-outcomes"
          heading="Themes across our delivery work"
          paragraphs={[
            "Across fintech, logistics, retail, and B2B SaaS we see recurring needs: hardening mobile apps for multi-market releases, replacing legacy web stacks without freezing product roadmaps, and introducing automation where support teams drown in repetitive tickets. Each case study highlights the constraint we optimised for—not generic buzzwords.",
            "API and integration modernisation often means strangling monoliths gradually, versioning public endpoints, and communicating sunset timelines to partners. AI-assisted workflows focus on measurable deflection or triage quality, with logging and escalation paths so humans stay accountable.",
            "If your organisation is evaluating a similar trajectory, use these stories as conversation starters with your internal stakeholders, then bring your specifics to a consultation. We can map a phased plan that matches your risk appetite and existing team skills.",
          ]}
        />
      </main>
      <Footer />
    </div>
  );
}

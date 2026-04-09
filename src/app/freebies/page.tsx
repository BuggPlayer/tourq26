import type { Metadata } from "next";
import Link from "next/link";
import MarketingHeader from "@/components/MarketingHeader";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { freebies } from "@/data/freebies";
import { getSiteUrl } from "@/lib/site-url";
import { breadcrumbListJsonLd } from "@/lib/seo";
import { SupportingProseSection } from "@/components/marketing/SupportingProseSection";

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = await getSiteUrl();
  return {
    title: "Free Resources",
    description:
      "Free checklists, templates, and guides for product teams and founders: mobile app partner checklist, project brief template, pre-launch checklist, build vs buy guide.",
    alternates: { canonical: `${baseUrl}/freebies` },
    openGraph: {
      title: "Free Resources | Torq Studio",
      description: "Checklists, templates, and guides to help you choose partners, brief projects, and launch apps.",
      url: `${baseUrl}/freebies`,
    },
    robots: { index: true, follow: true },
  };
}

const typeLabel: Record<string, string> = {
  checklist: "Checklist",
  template: "Template",
  guide: "Guide",
};

export default async function FreebiesPage() {
  const siteUrl = await getSiteUrl();
  const breadcrumbLd = breadcrumbListJsonLd(siteUrl, [
    { name: "Home", path: "/" },
    { name: "Free resources", path: "/freebies" },
  ]);
  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={breadcrumbLd} />
      <MarketingHeader />
      <main>
        <section className="gradient-mesh relative border-b border-border/50 px-4 pt-32 pb-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-primary">
              Free resources
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl">
              Useful freebies
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Checklists, templates, and short guides to help you choose the right partner, brief projects, and launch with confidence.
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Use them in vendor workshops, internal steering meetings, or investor updates—they are written in plain language
              so non-technical stakeholders can follow. Nothing here requires an account; you can print or save as PDF from
              your browser.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <ul className="grid gap-6 sm:grid-cols-2">
            {freebies.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/freebies/${item.slug}`}
                  className="card-hover block rounded-2xl border border-border/50 bg-surface p-6 transition-colors hover:border-primary/30"
                >
                  <span className="text-xs font-medium uppercase tracking-wider text-primary">
                    {typeLabel[item.type] ?? item.type}
                  </span>
                  <h2 className="mt-2 font-display text-xl font-semibold text-foreground">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                  <span className="mt-4 inline-block text-sm font-medium text-primary">
                    View free resource →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-10 text-center text-sm text-muted-foreground">
            No sign-up required. Use them in your projects and share with your team.
          </p>
        </section>

        <SupportingProseSection
          id="freebies-editorial"
          heading="Why we publish free templates and checklists"
          paragraphs={[
            "Product and engineering teams repeatedly ask similar questions before kickoff: how to brief an agency, how to compare build versus buy versus partner, and what to verify before app store submission. These resources distil patterns we have seen across mobile, web, and API engagements.",
            "Each item is designed to be actionable in a meeting or workshop—you can print to PDF, duplicate sections into your own wiki, or share a link with stakeholders. They do not replace legal or compliance review, but they do align vocabulary and expectations before you invest in a long contract cycle.",
            "Torq Studio also ships open developer utilities under Dev tools for formatting, encoding, and quick technical checks. Combine those with the resources here when you are preparing a specification, reviewing a vendor proposal, or planning a launch checklist.",
            "The mobile partner checklist helps you score vendors on delivery, security, and communication habits. The project brief template captures goals, users, constraints, and success metrics in one place. The pre-launch checklist covers store policies, analytics, crash reporting, and rollback. The build-versus-buy guide frames decision criteria for executives who need a short, balanced summary.",
          ]}
        />
      </main>
      <Footer />
    </div>
  );
}

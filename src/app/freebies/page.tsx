import type { Metadata } from "next";
import Link from "next/link";
import MarketingHeader from "@/components/MarketingHeader";
import { requireMarketingFeature } from "@/lib/require-marketing-feature";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { freebies } from "@/data/freebies";
import { getSiteUrl } from "@/lib/site-url";
import { breadcrumbListJsonLd } from "@/lib/seo";

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
  await requireMarketingFeature("marketing_freebies", "marketing_freebies");
  const siteUrl = await getSiteUrl();
  const breadcrumbLd = breadcrumbListJsonLd(siteUrl, [
    { name: "Home", path: "/" },
    { name: "Free resources", path: "/freebies" },
  ]);
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <JsonLd data={breadcrumbLd} />
      <MarketingHeader />
      <main>
        <section className="gradient-mesh relative border-b border-[var(--color-border)]/50 px-4 pt-32 pb-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-[var(--color-primary)]">
              Free resources
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
              Useful freebies
            </h1>
            <p className="mt-6 text-lg text-[var(--color-muted)]">
              Checklists, templates, and short guides to help you choose the right partner, brief projects, and launch with confidence.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <ul className="grid gap-6 sm:grid-cols-2">
            {freebies.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/freebies/${item.slug}`}
                  className="card-hover block rounded-2xl border border-[var(--color-border)]/50 bg-[var(--surface)] p-6 transition-colors hover:border-[var(--color-primary)]/30"
                >
                  <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-primary)]">
                    {typeLabel[item.type] ?? item.type}
                  </span>
                  <h2 className="mt-2 font-display text-xl font-semibold text-white">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-sm text-[var(--color-muted)] leading-relaxed">
                    {item.description}
                  </p>
                  <span className="mt-4 inline-block text-sm font-medium text-[var(--color-primary)]">
                    View free resource →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-10 text-center text-sm text-[var(--color-muted)]">
            No sign-up required. Use them in your projects and share with your team.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}

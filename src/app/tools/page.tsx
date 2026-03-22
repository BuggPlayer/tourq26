import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { tools, type ToolAudience } from "@/data/tools";
import { getSiteUrl } from "@/lib/site-url";
import { breadcrumbListJsonLd } from "@/lib/seo";
import { readSiteContent } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = await getSiteUrl();
  const site = await readSiteContent();
  return {
    title: "Free AI tools for founders & teams",
    description:
      "Free AI tools: software budgets, vendor evaluation, RFPs, tech stack trade-offs, interview prep, founder one-pagers, and engineering job posts. From Torq Studio — drafts only, not professional advice.",
    alternates: { canonical: `${baseUrl}/tools` },
    openGraph: {
      title: `Free AI tools | ${site.siteName}`,
      description:
        "Budgets, RFPs, stack trade-offs, interviews, pitches, and job posts — with on-page methodology and disclaimers.",
      url: `${baseUrl}/tools`,
    },
    robots: { index: true, follow: true },
  };
}

const audienceLabel: Record<ToolAudience, string> = {
  founder: "Founders",
  engineer: "Engineers",
  hiring: "Hiring",
};

function audiencesForTool(audiences: ToolAudience[]): string {
  return audiences.map((a) => audienceLabel[a]).join(" · ");
}

export default async function ToolsPage() {
  const siteUrl = await getSiteUrl();
  const breadcrumbLd = breadcrumbListJsonLd(siteUrl, [
    { name: "Home", path: "/" },
    { name: "Tools", path: "/tools" },
  ]);

  const live = tools.filter((t) => t.status === "live");
  const soon = tools.filter((t) => t.status === "coming_soon");

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <JsonLd data={breadcrumbLd} />
      <Header />
      <main>
        <section className="gradient-mesh relative border-b border-[var(--color-border)]/50 px-4 pt-32 pb-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-[var(--color-primary)]">
              Free tools
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
              AI-assisted tools for builders
            </h1>
            <p className="mt-6 text-lg text-[var(--color-muted)]">
              Budgets, vendor selection, RFPs, architecture trade-offs, interview prep, founder intros, and job posts. Each page explains how to use the output — AI speeds drafting; you own the decisions.
            </p>
            <p className="mt-6 text-sm text-[var(--color-muted)]">
              Prefer downloadable assets? See our{" "}
              <Link href="/freebies" className="text-[var(--color-primary)] hover:underline">
                free checklists &amp; templates
              </Link>
              . Need a build partner?{" "}
              <Link href="/contact" className="text-[var(--color-primary)] hover:underline">
                Get in touch
              </Link>
              .
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="font-display text-xl font-semibold text-white">Available now</h2>
          <ul className="mt-6 grid gap-6 sm:grid-cols-2">
            {live.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/tools/${item.slug}`}
                  className="card-hover block h-full rounded-2xl border border-[var(--color-border)]/50 bg-[var(--surface)] p-6 transition-colors hover:border-[var(--color-primary)]/30"
                >
                  <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-primary)]">
                    {audiencesForTool(item.audiences)}
                  </span>
                  <h3 className="mt-2 font-display text-xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm text-[var(--color-muted)] leading-relaxed">{item.description}</p>
                  <span className="mt-4 inline-block text-sm font-medium text-[var(--color-primary)]">
                    Open tool →
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {soon.length > 0 && (
            <>
              <h2 className="mt-16 font-display text-xl font-semibold text-white">Coming soon</h2>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {soon.map((item) => (
                  <li
                    key={item.slug}
                    className="rounded-2xl border border-dashed border-[var(--color-border)]/60 bg-[var(--surface)]/50 p-5"
                  >
                    <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-muted)]">
                      {audiencesForTool(item.audiences)}
                    </span>
                    <h3 className="mt-1 font-display text-lg font-semibold text-white/90">{item.title}</h3>
                    <p className="mt-2 text-sm text-[var(--color-muted)] leading-relaxed">{item.description}</p>
                  </li>
                ))}
              </ul>
            </>
          )}

          <p className="mt-12 rounded-xl border border-[var(--color-border)]/40 bg-[var(--surface)]/30 p-4 text-center text-xs text-[var(--color-muted)]">
            AI output may be inaccurate. Not legal, tax, investment, or engineering sign-off.{" "}
            <Link href="/privacy" className="text-[var(--color-primary)] hover:underline">
              Privacy
            </Link>
            .
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}

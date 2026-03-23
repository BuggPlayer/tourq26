import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import MarketingHeader from "@/components/MarketingHeader";
import { requireMarketingFeature } from "@/lib/require-marketing-feature";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import ToolRunner from "@/components/tools/ToolRunner";
import { getToolBySlug, tools } from "@/data/tools";
import { toolEditorial } from "@/data/tool-editorial";
import { getSiteUrl } from "@/lib/site-url";
import {
  breadcrumbListJsonLd,
  faqPageJsonLd,
  webApplicationJsonLd,
} from "@/lib/seo";
import type { LiveToolId } from "@/lib/tools/schemas";
import { LIVE_TOOL_IDS } from "@/lib/tools/schemas";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return tools.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  const baseUrl = await getSiteUrl();
  if (!tool) {
    return { title: "Tool" };
  }
  const editorial = toolEditorial[slug];
  const title = editorial?.metaTitle ?? tool.title;
  const description = editorial?.metaDescription ?? tool.description;
  return {
    title,
    description,
    alternates: { canonical: `${baseUrl}/tools/${slug}` },
    openGraph: {
      title: `${title} | Torq Studio`,
      description,
      url: `${baseUrl}/tools/${slug}`,
    },
    robots: { index: true, follow: true },
  };
}

function isLiveToolId(slug: string): slug is LiveToolId {
  return (LIVE_TOOL_IDS as readonly string[]).includes(slug);
}

export default async function ToolDetailPage({ params }: Props) {
  await requireMarketingFeature("marketing_tools", "marketing_tools");
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const siteUrl = await getSiteUrl();
  const editorial = toolEditorial[slug];
  const breadcrumbLd = breadcrumbListJsonLd(siteUrl, [
    { name: "Home", path: "/" },
    { name: "Tools", path: "/tools" },
    { name: tool.title, path: `/tools/${slug}` },
  ]);

  const faqsForLd =
    editorial?.faqs.map((f) => ({ question: f.q, answer: f.a })) ?? [];
  const faqLd = faqsForLd.length ? faqPageJsonLd(faqsForLd) : null;
  const webAppLd = webApplicationJsonLd({
    siteUrl,
    path: `/tools/${slug}`,
    name: tool.title,
    description: tool.description,
  });

  const isLive = tool.status === "live" && isLiveToolId(slug);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={webAppLd} />
      {faqLd && <JsonLd data={faqLd} />}
      <MarketingHeader />
      <main>
        <section className="gradient-mesh relative border-b border-[var(--color-border)]/50 px-4 pt-28 pb-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <Link
              href="/tools"
              className="text-sm font-medium text-[var(--color-primary)] hover:underline"
            >
              ← All tools
            </Link>
            <h1 className="mt-4 font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
              {tool.title}
            </h1>
            <p className="mt-4 text-lg text-[var(--color-muted)]">{tool.description}</p>
            {editorial && (
              <p className="mt-4 text-sm leading-relaxed text-[var(--color-muted)]">{editorial.intro}</p>
            )}
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          {editorial && (
            <div className="mb-12 rounded-2xl border border-[var(--color-border)]/50 bg-[var(--surface)]/60 p-6 sm:p-8">
              <h2 className="font-display text-lg font-semibold text-white">How this works</h2>
              <ul className="mt-4 list-disc space-y-3 pl-5 text-sm text-[var(--color-muted)] leading-relaxed">
                {editorial.methodology.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
              {slug === "vendor-evaluation" && (
                <p className="mt-6 text-sm text-[var(--color-muted)]">
                  Printable baseline:{" "}
                  <Link
                    href="/freebies/mobile-app-partner-checklist"
                    className="text-[var(--color-primary)] hover:underline"
                  >
                    Mobile app partner checklist
                  </Link>
                  .
                </p>
              )}
              {slug === "rfp-drafter" && (
                <p className="mt-6 text-sm text-[var(--color-muted)]">
                  Related read:{" "}
                  <Link
                    href="/blog/rfp-custom-software-how-to-write-one"
                    className="text-[var(--color-primary)] hover:underline"
                  >
                    How to write an RFP for custom software
                  </Link>
                  .
                </p>
              )}
              {slug === "job-post-generator" && (
                <p className="mt-6 text-sm text-[var(--color-muted)]">
                  Next step: use{" "}
                  <Link href="/tools/interview-prep" className="text-[var(--color-primary)] hover:underline">
                    Interview prep
                  </Link>{" "}
                  in hiring mode for structured questions.
                </p>
              )}
              {slug === "interview-prep" && (
                <p className="mt-6 text-sm text-[var(--color-muted)]">
                  Hiring? Draft the role with the{" "}
                  <Link
                    href="/tools/job-post-generator"
                    className="text-[var(--color-primary)] hover:underline"
                  >
                    Job post generator
                  </Link>
                  .
                </p>
              )}
            </div>
          )}

          {isLive ? (
            <ToolRunner toolId={slug} />
          ) : (
            <div className="rounded-2xl border border-dashed border-[var(--color-border)]/60 bg-[var(--surface)]/40 p-8 text-center">
              <p className="text-[var(--color-muted)]">
                This tool is on our roadmap. Want it sooner or a human-led workshop?
              </p>
              <Link
                href="/contact"
                className="mt-6 inline-flex rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-[var(--background)] hover:opacity-95"
              >
                Contact Torq Studio
              </Link>
            </div>
          )}

          {editorial && editorial.faqs.length > 0 && (
            <div className="mt-14 border-t border-[var(--color-border)]/40 pt-12">
              <h2 className="font-display text-lg font-semibold text-white">FAQ</h2>
              <dl className="mt-6 space-y-6">
                {editorial.faqs.map((f) => (
                  <div key={f.q}>
                    <dt className="font-medium text-white">{f.q}</dt>
                    <dd className="mt-2 text-sm text-[var(--color-muted)] leading-relaxed">{f.a}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <p className="mt-12 text-center text-xs text-[var(--color-muted)]">
            AI-generated drafts: verify facts before sharing externally. Not legal, financial, or investment advice.{" "}
            <Link href="/privacy" className="text-[var(--color-primary)] hover:underline">
              How we handle data
            </Link>
            .
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}

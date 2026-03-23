import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import MarketingHeader from "@/components/MarketingHeader";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { getServicePage, servicePages } from "@/data/services-content";
import { readBlogPosts, readSiteContent } from "@/lib/content";
import { getSiteUrl } from "@/lib/site-url";
import { breadcrumbListJsonLd, faqPageJsonLd, webPageJsonLd } from "@/lib/seo";

export async function generateStaticParams() {
  return servicePages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getServicePage(slug);
  if (!page) return { title: "Service not found", robots: { index: false, follow: false } };
  const site = await readSiteContent();
  const baseUrl = site.siteUrl.replace(/\/$/, "");
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `${baseUrl}/services/${page.slug}` },
    openGraph: {
      title: `${page.title} | Torq Studio`,
      description: page.description,
      url: `${baseUrl}/services/${page.slug}`,
    },
    robots: { index: true, follow: true },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getServicePage(slug);
  if (!page) notFound();

  const [siteUrl, allPosts] = await Promise.all([getSiteUrl(), readBlogPosts()]);

  const relatedPosts = (page.relatedBlogSlugs ?? [])
    .map((s) => allPosts.find((p) => p.slug === s))
    .filter((p): p is NonNullable<typeof p> => p != null);

  const faqLd = faqPageJsonLd(page.faqs);
  const breadcrumbLd = breadcrumbListJsonLd(siteUrl, [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: page.title, path: `/services/${page.slug}` },
  ]);
  const webLd = webPageJsonLd({
    siteUrl,
    path: `/services/${page.slug}`,
    name: `${page.title} | Torq Studio`,
    description: page.description,
  });

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <JsonLd data={faqLd} />
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={webLd} />
      <MarketingHeader />
      <main>
        <article className="mx-auto max-w-3xl px-4 pt-32 pb-20 sm:px-6 lg:px-8">
          <Link
            href="/services"
            className="text-sm text-[var(--color-muted)] hover:text-[var(--color-primary)]"
          >
            ← All services
          </Link>
          <header className="mt-6">
            <h1 className="font-display text-3xl font-bold text-white sm:text-4xl md:text-5xl">{page.h1}</h1>
            <p className="mt-6 text-lg text-[var(--color-muted)] leading-relaxed">{page.intro}</p>
          </header>

          {page.sections.map((section) => (
            <section key={section.heading} className="mt-12">
              <h2 className="font-display text-xl font-semibold text-white sm:text-2xl">{section.heading}</h2>
              <div
                className="prose prose-invert mt-4 max-w-none [&_p]:text-[var(--color-muted)] [&_p]:leading-relaxed [&_ul]:text-[var(--color-muted)] [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mt-1 [&_strong]:text-white/95"
                dangerouslySetInnerHTML={{ __html: section.body }}
              />
            </section>
          ))}

          <section className="mt-16 border-t border-[var(--color-border)]/40 pt-12">
            <h2 className="font-display text-xl font-semibold text-white sm:text-2xl">
              Frequently asked questions
            </h2>
            <ul className="mt-6 space-y-8">
              {page.faqs.map((f) => (
                <li key={f.question}>
                  <h3 className="text-base font-semibold text-white">{f.question}</h3>
                  <p className="mt-2 text-sm text-[var(--color-muted)] leading-relaxed">{f.answer}</p>
                </li>
              ))}
            </ul>
          </section>

          {relatedPosts.length > 0 && (
            <section className="mt-14 border-t border-[var(--color-border)]/40 pt-10">
              <h2 className="font-display text-lg font-semibold text-white">Related reading</h2>
              <ul className="mt-4 space-y-3">
                {relatedPosts.map((post) =>
                  post ? (
                    <li key={post.slug}>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-sm font-medium text-[var(--color-primary)] hover:underline"
                      >
                        {post.title}
                      </Link>
                      <p className="mt-1 text-xs text-[var(--color-muted)]">{post.description}</p>
                    </li>
                  ) : null
                )}
              </ul>
            </section>
          )}

          <div className="mt-14 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/contact"
              className="inline-flex justify-center rounded-full bg-[var(--color-primary)] px-8 py-3.5 text-sm font-semibold text-[var(--background)] hover:bg-[var(--color-primary-hover)]"
            >
              Book a free consultation
            </Link>
            <Link
              href="/case-studies"
              className="text-center text-sm text-[var(--color-muted)] hover:text-[var(--color-primary)] sm:text-right"
            >
              See case studies →
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}

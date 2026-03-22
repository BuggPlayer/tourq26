import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { servicePages } from "@/data/services-content";
import { getSiteUrl } from "@/lib/site-url";
import { breadcrumbListJsonLd, webPageJsonLd } from "@/lib/seo";
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
    <div className="min-h-screen bg-[var(--background)]">
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={webLd} />
      <Header />
      <main>
        <section className="gradient-mesh relative border-b border-[var(--color-border)]/40 px-4 pt-32 pb-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-[var(--color-primary)]">
              What we deliver
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
              What we build &amp; advise on
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-[var(--color-muted)]">
              Senior software engineers offering delivery and consulting. Each page covers how we work, what
              “good” looks like, and FAQs founders and engineering leads actually ask.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            {servicePages.map((p) => (
              <Link
                key={p.slug}
                href={`/services/${p.slug}`}
                className="card-hover group flex flex-col rounded-2xl border border-[var(--color-border)]/40 bg-[var(--surface)] p-8 transition-colors hover:border-[var(--color-primary)]/30"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-accent)]/15 text-[var(--color-primary)]">
                  <Image
                    src={iconMap[p.slug] ?? "/images/icons/web.svg"}
                    alt=""
                    width={28}
                    height={28}
                    className="opacity-90"
                    unoptimized
                  />
                </span>
                <h2 className="mt-5 font-display text-xl font-semibold text-white sm:text-2xl group-hover:text-[var(--color-primary)]">
                  {p.title}
                </h2>
                <p className="mt-3 flex-1 text-sm text-[var(--color-muted)] leading-relaxed">{p.description}</p>
                <span className="mt-6 text-sm font-semibold text-[var(--color-primary)]">
                  Read service overview →
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

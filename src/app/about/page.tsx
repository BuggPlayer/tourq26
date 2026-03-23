import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import MarketingHeader from "@/components/MarketingHeader";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { getSiteUrl } from "@/lib/site-url";
import { breadcrumbListJsonLd } from "@/lib/seo";
import { sitePhotos } from "@/data/site-photos";

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = await getSiteUrl();
  return {
    title: "About Us",
    description:
      "Torq Studio is led by senior software engineers who build and advise: mobile apps, websites, AI, and technical consulting for teams worldwide.",
    alternates: { canonical: `${baseUrl}/about` },
    openGraph: {
      title: "About Torq Studio | Senior Engineers, Build & Consulting",
      description:
        "Mobile, web, AI, and hands-on technical consulting—direct access to engineers who still ship production code.",
      url: `${baseUrl}/about`,
    },
    robots: { index: true, follow: true },
  };
}

const values = [
  {
    title: "Quality first",
    description: "We ship on time without cutting corners. Rigorous testing and senior talent so your product stands up in production.",
  },
  {
    title: "Transparent partnership",
    description: "Clear communication, honest timelines, and no hidden costs. You work with senior engineers who own outcomes—not endless account layers.",
  },
  {
    title: "Global reach, local impact",
    description: "We serve clients worldwide with remote teams that deliver. Reduce costs by up to 40% while keeping quality high.",
  },
];

export default async function AboutPage() {
  const siteUrl = await getSiteUrl();
  const breadcrumbLd = breadcrumbListJsonLd(siteUrl, [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
  ]);
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <JsonLd data={breadcrumbLd} />
      <MarketingHeader />
      <main>
        <section className="gradient-mesh relative border-b border-[var(--color-border)]/40 px-4 pt-32 pb-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-[var(--color-primary)]">
              Who we are
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
              Senior engineers you can actually talk to
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-[var(--color-muted)]">
              Torq Studio combines <strong className="text-white/90 font-semibold">delivery and consulting</strong>: mobile apps,
              websites and web apps, AI integrations, and technical advice—architecture, estimates, reviews, and execution when you are ready.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="relative order-2 overflow-hidden rounded-2xl border border-[var(--color-border)]/50 bg-[var(--surface)] shadow-xl ring-1 ring-white/5 lg:order-1">
              <div className="relative aspect-[4/3] lg:aspect-[3/4] lg:min-h-[320px]">
                <Image
                  src={sitePhotos.aboutMission.src}
                  alt={sitePhotos.aboutMission.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--background)]/50 to-transparent"
                  aria-hidden
                />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
                Our mission
              </h2>
              <p className="mt-4 text-[var(--color-muted)] leading-relaxed">
                Help you make the <strong className="text-white/90 font-semibold">right technical bets</strong>—then implement them. Whether you need a senior engineer to own delivery, a second opinion before you hire or outsource, or a partner for mobile, web, and AI, we keep the conversation honest and the work production-grade.
              </p>
              <p className="mt-4 text-[var(--color-muted)] leading-relaxed">
                Many clients save significantly versus hiring only in high-cost markets, without giving up senior quality. Clear scopes, direct communication, and no bait-and-switch: you know who is doing the work.
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-[var(--color-border)]/40 bg-[var(--surface)] py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
              What we stand for
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {values.map((item, i) => (
                <div
                  key={item.title}
                  className="card-hover rounded-2xl border border-[var(--color-border)]/40 bg-[var(--background)] p-6"
                >
                  <span className="text-sm font-semibold text-[var(--color-primary)]">
                    0{i + 1}
                  </span>
                  <h3 className="mt-3 font-display text-lg font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--color-muted)] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-[var(--color-border)]/40 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
              Ready to build?
            </h2>
            <p className="mt-4 text-[var(--color-muted)]">
              Free 30-min consultation. We’ll listen and outline how we can help.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/contact"
                className="btn-primary rounded-full bg-[var(--color-primary)] px-8 py-4 text-base font-semibold text-[var(--background)]"
              >
                Get in touch
              </Link>
              <Link
                href="/#case-studies"
                className="rounded-full border border-[var(--color-border)] px-8 py-4 text-base font-semibold text-white transition-all hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-muted)]"
              >
                See case studies
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

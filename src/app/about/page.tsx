import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://torqstudio.com").replace(/\/$/, "");

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Torq Studio is your trusted technology partner. Learn about our mission, values, and how we help businesses scale with mobile apps, web, AI, and remote IT teams worldwide.",
  alternates: { canonical: `${baseUrl}/about` },
  openGraph: {
    title: "About Torq Studio | Your Technology Partner",
    description:
      "We help businesses scale smarter with mobile apps, web development, AI solutions, and remote IT. Learn our story and what drives us.",
    url: `${baseUrl}/about`,
  },
  robots: { index: true, follow: true },
};

const values = [
  {
    title: "Quality first",
    description: "We ship on time without cutting corners. Rigorous testing and senior talent so your product stands up in production.",
  },
  {
    title: "Transparent partnership",
    description: "Clear communication, honest timelines, and no hidden costs. You get a dedicated team that feels like an extension of yours.",
  },
  {
    title: "Global reach, local impact",
    description: "We serve clients worldwide with remote teams that deliver. Reduce costs by up to 40% while keeping quality high.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />
      <main>
        <section className="gradient-mesh relative border-b border-[var(--color-border)]/50 px-4 pt-32 pb-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-[var(--color-primary)]">
              Who we are
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
              Your trusted technology partner for growth
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-[var(--color-muted)]">
              Torq Studio helps businesses worldwide scale smarter and faster. We build mobile apps, web platforms, AI solutions, and provide remote IT resources—so you can focus on what matters while we deliver on time, every time.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex justify-center py-6 text-[var(--color-primary)] opacity-60">
            <Image
              src="/images/about-illustration.svg"
              alt=""
              width={320}
              height={200}
              className="h-40 w-auto"
              unoptimized
            />
          </div>
          <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
            Our mission
          </h2>
          <p className="mt-4 text-[var(--color-muted)] leading-relaxed">
            We exist to turn your ideas into results. Whether you need a mobile app, a modern web product, AI integration, or a dedicated remote team, we bring senior engineering and design talent so you can ship with confidence and reduce development costs by up to 40%.
          </p>
          <p className="mt-4 text-[var(--color-muted)] leading-relaxed">
            We believe in transparent partnerships: clear timelines, honest communication, and no surprises. Our clients range from startups to enterprises, and we serve them globally with the same commitment to quality and on-time delivery.
          </p>
        </section>

        <section className="border-t border-[var(--color-border)]/50 bg-[var(--surface)] py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
              What we stand for
            </h2>
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {values.map((item, i) => (
                <div
                  key={item.title}
                  className="card-hover rounded-2xl border border-[var(--color-border)]/50 bg-[var(--background)] p-6"
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

        <section className="border-t border-[var(--color-border)]/50 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
              Ready to build something great?
            </h2>
            <p className="mt-4 text-[var(--color-muted)]">
              Get a free 30-minute consultation. We’ll listen to your goals and outline how we can help.
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
                className="rounded-full border border-[var(--color-border)] px-8 py-4 text-base font-semibold text-white transition-colors hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-muted)]"
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

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { freebies } from "@/data/freebies";
import { getFreebieContent } from "@/data/freebie-content";

const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://torqstudio.com").replace(/\/$/, "");

export async function generateStaticParams() {
  return freebies.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const freebie = freebies.find((f) => f.slug === slug);
  if (!freebie) return { title: "Freebie not found" };
  return {
    title: freebie.title,
    description: freebie.description,
    alternates: { canonical: `${baseUrl}/freebies/${freebie.slug}` },
    openGraph: {
      title: `${freebie.title} | Torq Studio Free Resources`,
      description: freebie.description,
      url: `${baseUrl}/freebies/${freebie.slug}`,
    },
    robots: { index: true, follow: true },
  };
}

export default async function FreebiePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const freebie = freebies.find((f) => f.slug === slug);
  if (!freebie) notFound();

  const Content = getFreebieContent(slug);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />
      <main>
        <article className="mx-auto max-w-3xl px-4 pt-32 pb-20 sm:px-6 lg:px-8">
          <Link
            href="/freebies"
            className="text-sm text-[var(--color-muted)] hover:text-[var(--color-primary)]"
          >
            ← All free resources
          </Link>
          <header className="mt-6">
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-primary)]">
              Free resource
            </span>
            <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
              {freebie.title}
            </h1>
            <p className="mt-4 text-lg text-[var(--color-muted)] leading-relaxed">
              {freebie.description}
            </p>
          </header>
          <div className="prose prose-invert mt-10 max-w-none [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-white [&_h2]:mt-10 [&_h3]:font-display [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-white [&_h3]:mt-6 [&_p]:text-[var(--color-muted)] [&_p]:leading-relaxed [&_ul]:text-[var(--color-muted)] [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mt-1 [&_input]:rounded [&_input]:border [&_input]:border-[var(--color-border)] [&_input]:bg-[var(--surface)] [&_input]:px-2 [&_input]:py-1">
            {Content && <Content />}
          </div>
          <div className="mt-14 flex flex-wrap items-center gap-4 border-t border-[var(--color-border)]/50 pt-8">
            <p className="text-sm text-[var(--color-muted)]">
              Use Ctrl+P / Cmd+P to print or save as PDF.
            </p>
            <Link
              href="/contact"
              className="inline-block rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-[var(--background)] hover:bg-[var(--color-primary-hover)]"
            >
              Get a free consultation
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}

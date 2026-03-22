import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { readBlogPosts } from "@/lib/content";
import { getSiteUrl } from "@/lib/site-url";
import { breadcrumbListJsonLd } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = await getSiteUrl();
  return {
    title: "Blog",
    description:
      "Insights on mobile app development, web development, AI solutions, and remote IT teams. Tips and guides from Torq Studio to help you scale smarter.",
    alternates: { canonical: `${baseUrl}/blog` },
    openGraph: {
      title: "Blog | Torq Studio – Mobile, Web, AI & Remote IT",
      description:
        "Guides and insights on choosing development partners, AI for business, and building with remote teams.",
      url: `${baseUrl}/blog`,
    },
    robots: { index: true, follow: true },
  };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPage() {
  const [blogPosts, siteUrl] = await Promise.all([readBlogPosts(), getSiteUrl()]);
  const breadcrumbLd = breadcrumbListJsonLd(siteUrl, [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
  ]);
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <JsonLd data={breadcrumbLd} />
      <Header />
      <main>
        <section className="gradient-mesh relative border-b border-[var(--color-border)]/50 px-4 pt-32 pb-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-[var(--color-primary)]">
              Insights
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
              Blog
            </h1>
            <p className="mt-6 text-lg text-[var(--color-muted)]">
              Practical guides on mobile app development, web, AI, and remote teams—from your technology partner.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <ul className="space-y-10">
            {blogPosts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="card-hover block rounded-2xl border border-[var(--color-border)]/50 bg-[var(--surface)] p-6 transition-colors hover:border-[var(--color-primary)]/30"
                >
                  <time className="text-sm text-[var(--color-muted)]" dateTime={post.date}>
                    {formatDate(post.date)}
                  </time>
                  <h2 className="mt-2 font-display text-xl font-semibold text-white sm:text-2xl">
                    {post.title}
                  </h2>
                  <p className="mt-2 text-[var(--color-muted)] leading-relaxed">
                    {post.description}
                  </p>
                  <span className="mt-4 inline-block text-sm font-medium text-[var(--color-primary)]">
                    Read more →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import MarketingHeader from "@/components/MarketingHeader";
import { requireMarketingFeature } from "@/lib/require-marketing-feature";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { readBlogPosts, readSiteContent } from "@/lib/content";
import { getSiteUrl } from "@/lib/site-url";
import { sanitizeBlogHtml } from "@/lib/blog-sanitize";
import { blogPostingJsonLd, breadcrumbListJsonLd } from "@/lib/seo";

export async function generateStaticParams() {
  const posts = await readBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [posts, site] = await Promise.all([readBlogPosts(), readSiteContent()]);
  const post = posts.find((p) => p.slug === slug);
  if (!post) return { title: "Post not found", robots: { index: false, follow: false } };
  const baseUrl = site.siteUrl.replace(/\/$/, "");
  const ogImage = `/blog/${post.slug}/opengraph-image`;
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `${baseUrl}/blog/${post.slug}` },
    openGraph: {
      title: `${post.title} | Torq Studio Blog`,
      description: post.description,
      url: `${baseUrl}/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | Torq Studio Blog`,
      description: post.description,
      images: [ogImage],
      ...(site.twitterSite
        ? { site: `@${site.twitterSite}`, creator: `@${site.twitterSite}` }
        : {}),
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

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await requireMarketingFeature("marketing_blog", "marketing_blog");
  const { slug } = await params;
  const [posts, site, siteUrl] = await Promise.all([
    readBlogPosts(),
    readSiteContent(),
    getSiteUrl(),
  ]);
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  const authorLabel = post.authorName?.trim() || site.siteName;
  const articleLd = blogPostingJsonLd({
    siteUrl,
    slug: post.slug,
    title: post.title,
    description: post.description,
    datePublished: post.date,
    siteName: site.siteName,
    authorName: post.authorName,
  });
  const breadcrumbLd = breadcrumbListJsonLd(siteUrl, [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: post.title, path: `/blog/${post.slug}` },
  ]);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <JsonLd data={articleLd} />
      <JsonLd data={breadcrumbLd} />
      <MarketingHeader />
      <main>
        <article className="mx-auto max-w-3xl px-4 pt-32 pb-20 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="text-sm text-[var(--color-muted)] hover:text-[var(--color-primary)]"
          >
            ← Blog
          </Link>
          <header className="mt-6">
            <time className="text-sm text-[var(--color-muted)]" dateTime={post.date}>
              {formatDate(post.date)} · {post.readTime}
            </time>
            <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
              {post.title}
            </h1>
            <p className="mt-3 text-sm text-[var(--color-muted)]">
              By <span className="text-white/90">{authorLabel}</span>
            </p>
            <p className="mt-4 text-lg text-[var(--color-muted)] leading-relaxed">
              {post.description}
            </p>
          </header>
          <div
            className="prose prose-invert mt-10 max-w-none [&_h1]:font-display [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-white [&_h1]:mt-12 [&_h1]:mb-4 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-white [&_h2]:mt-10 [&_h3]:font-semibold [&_h3]:text-white [&_p]:text-[var(--color-muted)] [&_p]:leading-relaxed [&_ul]:text-[var(--color-muted)] [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mt-1 [&_a]:text-[var(--color-primary)] [&_a]:underline-offset-2 [&_pre]:rounded-lg [&_pre]:bg-[var(--surface)] [&_pre]:p-4 [&_code]:text-sm"
            dangerouslySetInnerHTML={{ __html: sanitizeBlogHtml(post.body || "") }}
          />
          <div className="mt-14 border-t border-[var(--color-border)]/50 pt-8">
            <Link
              href="/contact"
              className="inline-block rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-[var(--background)] hover:bg-[var(--color-primary-hover)]"
            >
              Get in touch for a free consultation
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}

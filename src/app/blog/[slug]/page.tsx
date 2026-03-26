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
import { BlogRelatedPosts } from "@/components/blog/BlogRelatedPosts";
import {
  authorInitials,
  blogPostsExcluding,
  formatBlogDate,
  sortBlogPostsByDateDesc,
} from "@/lib/blog-display";

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
  const sorted = sortBlogPostsByDateDesc(posts);
  const post = sorted.find((p) => p.slug === slug);
  if (!post) notFound();

  const authorLabel = post.authorName?.trim() || site.siteName;
  const related = blogPostsExcluding(sorted, post.slug, 3);

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
    <div className="min-h-screen bg-background">
      <JsonLd data={articleLd} />
      <JsonLd data={breadcrumbLd} />
      <MarketingHeader />
      <main>
        <article>
          <header className="relative border-b border-border/40 bg-gradient-to-b from-surface/90 via-background to-background">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_50%_-10%,var(--app-primary-muted),transparent)] opacity-80" aria-hidden />
            <div className="relative mx-auto max-w-3xl px-4 pt-28 pb-12 sm:px-6 sm:pt-32 lg:px-8 lg:pb-16">
              <nav aria-label="Breadcrumb" className="text-sm">
                <ol className="flex flex-wrap items-center gap-2 text-muted-foreground">
                  <li>
                    <Link href="/" className="transition-colors hover:text-foreground">
                      Home
                    </Link>
                  </li>
                  <li aria-hidden className="text-muted-foreground/50">
                    /
                  </li>
                  <li>
                    <Link href="/blog" className="transition-colors hover:text-foreground">
                      Blog
                    </Link>
                  </li>
                </ol>
              </nav>

              <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <time dateTime={post.date}>{formatBlogDate(post.date)}</time>
                <span className="text-muted-foreground/45" aria-hidden>
                  ·
                </span>
                <span>{post.readTime}</span>
              </div>

              <h1 className="mt-4 font-display text-3xl font-bold leading-[1.12] tracking-tight text-foreground sm:text-4xl lg:text-[2.65rem] lg:leading-[1.1]">
                {post.title}
              </h1>

              <p className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl">{post.description}</p>

              <div className="mt-8 flex items-center gap-4 border-t border-border/30 pt-8">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border/50 bg-primary/10 font-display text-sm font-bold text-primary"
                  aria-hidden
                >
                  {authorInitials(authorLabel)}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{authorLabel}</p>
                  <p className="text-sm text-muted-foreground">Author</p>
                </div>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <div
              className="blog-article mx-auto"
              dangerouslySetInnerHTML={{ __html: sanitizeBlogHtml(post.body || "") }}
            />

            <BlogRelatedPosts posts={related} />

            <div className="mt-14 rounded-2xl border border-border/50 bg-surface/50 p-8 text-center sm:p-10">
              <p className="font-display text-lg font-semibold text-foreground sm:text-xl">Planning a product or a team?</p>
              <p className="mx-auto mt-2 max-w-md text-muted-foreground">
                Share what you&apos;re building—we&apos;ll help you scope the right next step.
              </p>
              <Link
                href="/contact"
                className="mt-8 inline-flex items-center justify-center rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
              >
                Get in touch
              </Link>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}

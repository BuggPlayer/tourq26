import type { Metadata } from "next";
import MarketingHeader from "@/components/MarketingHeader";
import { requireMarketingFeature } from "@/lib/require-marketing-feature";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { readBlogPosts } from "@/lib/content";
import { getSiteUrl } from "@/lib/site-url";
import { breadcrumbListJsonLd } from "@/lib/seo";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { sortBlogPostsByDateDesc } from "@/lib/blog-display";

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

export default async function BlogPage() {
  await requireMarketingFeature("marketing_blog", "marketing_blog");
  const [rawPosts, siteUrl] = await Promise.all([readBlogPosts(), getSiteUrl()]);
  const posts = sortBlogPostsByDateDesc(rawPosts);
  const breadcrumbLd = breadcrumbListJsonLd(siteUrl, [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
  ]);

  const [featured, ...rest] = posts;

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={breadcrumbLd} />
      <MarketingHeader />
      <main>
        <section className="hero-section relative overflow-hidden border-b border-border/40">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_50%_at_50%_-30%,var(--app-primary-muted),transparent)] opacity-90" aria-hidden />
          <div className="relative mx-auto max-w-4xl px-4 pt-36 pb-16 text-center sm:px-6 lg:px-8 lg:pt-40 lg:pb-20">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Insights</p>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem]">
              Ideas for building better products
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Practical guides on shipping, procurement, security, and working with remote engineering teams—written for
              founders, PMs, and technical leaders.
            </p>
            {posts.length > 0 ? (
              <p className="mt-6 text-sm text-muted-foreground/90">
                <span className="font-medium text-foreground/90">{posts.length}</span> articles
              </p>
            ) : null}
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          {posts.length === 0 ? (
            <p className="text-center text-muted-foreground">New articles are on the way. Check back soon.</p>
          ) : (
            <>
              {featured ? (
                <div className="mb-14 lg:mb-16">
                  <BlogPostCard post={featured} variant="featured" />
                </div>
              ) : null}
              {rest.length > 0 ? (
                <>
                  <div className="mb-8 flex items-end justify-between gap-4 border-b border-border/40 pb-4">
                    <h2 className="font-display text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                      More articles
                    </h2>
                  </div>
                  <ul className="grid gap-6 sm:grid-cols-2 lg:gap-8">
                    {rest.map((post) => (
                      <li key={post.slug}>
                        <BlogPostCard post={post} variant="compact" />
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
            </>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}

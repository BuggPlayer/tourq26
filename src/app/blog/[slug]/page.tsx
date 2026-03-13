import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { readBlogPosts } from "@/lib/content";

const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://torqstudio.com").replace(/\/$/, "");

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
  const posts = await readBlogPosts();
  const post = posts.find((p) => p.slug === slug);
  if (!post) return { title: "Post not found" };
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
  const { slug } = await params;
  const posts = await readBlogPosts();
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />
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
            <p className="mt-4 text-lg text-[var(--color-muted)] leading-relaxed">
              {post.description}
            </p>
          </header>
          <div
            className="prose prose-invert mt-10 max-w-none [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-white [&_h2]:mt-10 [&_p]:text-[var(--color-muted)] [&_p]:leading-relaxed [&_ul]:text-[var(--color-muted)] [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mt-1"
            dangerouslySetInnerHTML={{ __html: post.body || "" }}
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

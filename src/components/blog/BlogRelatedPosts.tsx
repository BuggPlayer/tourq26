import Link from "next/link";
import type { BlogPost } from "@/lib/content";
import { formatBlogDate } from "@/lib/blog-display";

type Props = {
  posts: BlogPost[];
  title?: string;
};

export function BlogRelatedPosts({
  posts,
  title = "Keep reading",
}: Props) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-16 border-t border-border/60 pt-12" aria-labelledby="related-posts-heading">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <h2
          id="related-posts-heading"
          className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl"
        >
          {title}
        </h2>
        <Link
          href="/blog"
          className="text-sm font-medium text-primary hover:text-primary-hover hover:underline underline-offset-4"
        >
          View all articles
        </Link>
      </div>
      <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="group flex h-full flex-col rounded-xl border border-border/50 bg-surface/40 p-5 transition-colors hover:border-primary/30 hover:bg-surface/70"
            >
              <time className="text-xs font-medium uppercase tracking-wide text-muted-foreground" dateTime={post.date}>
                {formatBlogDate(post.date)}
              </time>
              <p className="mt-2 font-display text-base font-semibold leading-snug text-foreground group-hover:text-primary">
                {post.title}
              </p>
              <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted-foreground">{post.description}</p>
              <span className="mt-4 text-sm font-medium text-primary">Read →</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

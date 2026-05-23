import Link from "next/link";
import type { BlogPost } from "@/lib/content";
import { formatBlogDate } from "@/lib/blog-display";

type Props = {
  posts: BlogPost[];
  title?: string;
};

/**
 * Related posts (DESIGN.md → article-card grid).
 * Sits below the long-form article body; flat hairline cards with mono
 * eyebrows and a uniform "READ →" affordance.
 */
export function BlogRelatedPosts({ posts, title = "Keep reading" }: Props) {
  if (posts.length === 0) return null;

  return (
    <section
      className="mt-16 border-t border-hairline pt-12"
      aria-labelledby="related-posts-heading"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mono-eyebrow text-muted-foreground">RELATED ARTICLES</p>
          <h2
            id="related-posts-heading"
            className="display-md mt-3 text-foreground"
          >
            {title}
          </h2>
        </div>
        <Link
          href="/blog"
          className="mono-button text-foreground hover:underline"
        >
          VIEW ALL ARTICLES →
        </Link>
      </div>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="card-flat card-hover group flex h-full flex-col"
            >
              <time
                className="mono-label text-muted-foreground"
                dateTime={post.date}
              >
                {formatBlogDate(post.date).toUpperCase()}
              </time>
              <p className="display-sm mt-4 text-foreground">{post.title}</p>
              <p className="mt-3 line-clamp-3 flex-1 text-[14px] leading-relaxed text-muted-foreground">
                {post.description}
              </p>
              <span className="mono-button mt-5 inline-flex items-center gap-1 border-t border-hairline pt-4 text-foreground transition-transform group-hover:translate-x-0.5">
                READ →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

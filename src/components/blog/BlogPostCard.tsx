import Link from "next/link";
import type { BlogPost } from "@/lib/content";
import { formatBlogDate } from "@/lib/blog-display";

type Props = {
  post: BlogPost;
  /** Large hero-style card for the latest post */
  variant?: "featured" | "compact";
};

/**
 * Blog post card (DESIGN.md → article-card).
 * Two flavours: a featured 2-col hero card (cover/gradient ribbon side panel,
 * editorial body) and a compact 1-col list card. Both share the same
 * flat-cornered, hairline-bordered chrome.
 */
export function BlogPostCard({ post, variant = "compact" }: Props) {
  const summary = post.excerpt?.trim() || post.description;
  const meta = (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <time dateTime={post.date} className="mono-label text-muted-foreground">
        {formatBlogDate(post.date).toUpperCase()}
      </time>
      <span className="mono-label text-muted-foreground/60" aria-hidden>
        ·
      </span>
      <span className="mono-label text-muted-foreground">
        {post.readTime.toUpperCase()}
      </span>
    </div>
  );

  const tagChips =
    post.tags && post.tags.length > 0 ? (
      <ul className="mt-4 flex flex-wrap gap-1.5">
        {post.tags.slice(0, 3).map((t) => (
          <li
            key={t}
            className="mono-label rounded-full bg-muted px-2 py-0.5 text-muted-foreground"
          >
            {t.toUpperCase()}
          </li>
        ))}
      </ul>
    ) : null;

  if (variant === "featured") {
    return (
      <article>
        <Link
          href={`/blog/${post.slug}`}
          className="card-flat card-hover group flex flex-col overflow-hidden p-0 md:flex-row md:min-h-[280px]"
        >
          <div
            className="relative min-h-[160px] shrink-0 border-b border-hairline md:w-[38%] md:border-b-0 md:border-r"
            aria-hidden
          >
            {post.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.coverImage}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="brand-ribbon absolute inset-0 rounded-none">
                <div className="ribbon-inner" />
              </div>
            )}
            <div className="absolute bottom-5 left-5 right-5 md:bottom-7 md:left-7">
              <span className="mono-eyebrow inline-flex bg-white px-2 py-1.5 text-foreground">
                FEATURED
              </span>
            </div>
          </div>
          <div className="flex flex-1 flex-col justify-center p-8 md:p-10 lg:p-12">
            {meta}
            <h2 className="display-lg mt-4 text-foreground transition-opacity group-hover:opacity-80">
              {post.title}
            </h2>
            <p className="mt-4 line-clamp-3 text-[16px] leading-relaxed text-muted-foreground md:line-clamp-4">
              {summary}
            </p>
            {tagChips}
            <span className="mono-button mt-6 inline-flex items-center gap-2 text-foreground transition-transform group-hover:translate-x-1">
              READ ARTICLE →
            </span>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article>
      <Link
        href={`/blog/${post.slug}`}
        className="card-flat card-hover group flex h-full flex-col overflow-hidden p-0"
      >
        {post.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverImage}
            alt=""
            className="aspect-[1200/630] w-full border-b border-hairline object-cover"
          />
        ) : null}
        <div className="flex flex-1 flex-col p-6">
          {meta}
          <h2 className="display-md mt-4 text-foreground transition-opacity group-hover:opacity-80">
            {post.title}
          </h2>
          <p className="mt-3 line-clamp-3 flex-1 text-[15px] leading-relaxed text-muted-foreground">
            {summary}
          </p>
          {tagChips}
          <span className="mono-button mt-5 inline-flex items-center gap-1.5 border-t border-hairline pt-4 text-foreground transition-transform group-hover:translate-x-0.5">
            CONTINUE READING →
          </span>
        </div>
      </Link>
    </article>
  );
}

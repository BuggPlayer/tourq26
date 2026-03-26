import Link from "next/link";
import type { BlogPost } from "@/lib/content";
import { formatBlogDate } from "@/lib/blog-display";

type Props = {
  post: BlogPost;
  /** Large hero-style card for the latest post */
  variant?: "featured" | "compact";
};

export function BlogPostCard({ post, variant = "compact" }: Props) {
  const meta = (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
      <time dateTime={post.date}>{formatBlogDate(post.date)}</time>
      <span className="text-muted-foreground/40" aria-hidden>
        ·
      </span>
      <span>{post.readTime}</span>
    </div>
  );

  if (variant === "featured") {
    return (
      <article>
        <Link
          href={`/blog/${post.slug}`}
          className="group relative flex flex-col overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-surface-elevated/90 via-surface/80 to-surface/40 shadow-[0_1px_0_0_rgb(255_255_255/0.04)_inset] transition-all duration-300 hover:border-primary/35 hover:shadow-[var(--shadow-card)] md:flex-row md:min-h-[280px]"
        >
          <div
            className="relative min-h-[140px] shrink-0 border-b border-border/40 bg-gradient-to-br from-primary/20 via-accent/10 to-transparent md:w-[38%] md:border-b-0 md:border-r md:border-border/40"
            aria-hidden
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_30%_20%,var(--app-primary-muted),transparent)] opacity-90" />
            <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8">
              <span className="inline-flex rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                Latest
              </span>
            </div>
          </div>
          <div className="flex flex-1 flex-col justify-center p-8 md:p-10 lg:pl-12">
            {meta}
            <h2 className="mt-4 font-display text-2xl font-bold leading-[1.15] tracking-tight text-foreground transition-colors group-hover:text-primary md:text-3xl lg:text-[2rem]">
              {post.title}
            </h2>
            <p className="mt-4 line-clamp-3 text-base leading-relaxed text-muted-foreground md:line-clamp-4 md:text-lg">
              {post.description}
            </p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
              Read article
              <span
                className="transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden
              >
                →
              </span>
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
        className="group flex h-full flex-col rounded-2xl border border-border/50 bg-surface/50 p-6 transition-all duration-200 hover:border-primary/25 hover:bg-surface-elevated/60 hover:shadow-md sm:p-7"
      >
        {meta}
        <h2 className="mt-3 font-display text-lg font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-xl">
          {post.title}
        </h2>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
          {post.description}
        </p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary/90 group-hover:text-primary">
          Continue reading
          <span className="transition-transform group-hover:translate-x-0.5" aria-hidden>
            →
          </span>
        </span>
      </Link>
    </article>
  );
}

"use client";

import { sanitizeBlogHtml } from "@/lib/blog-sanitize";

type Props = {
  title: string;
  description: string;
  date: string;
  readTime: string;
  authorName: string;
  bodyHtml: string;
};

export function BlogPostPreview({
  title,
  description,
  date,
  readTime,
  authorName,
  bodyHtml,
}: Props) {
  const safe = sanitizeBlogHtml(bodyHtml);
  return (
    <article className="rounded-xl border border-border bg-background p-6 text-left text-foreground">
      <p className="text-sm text-muted-foreground">
        {date} · {readTime}
      </p>
      <h1 className="mt-2 font-display text-2xl font-bold text-foreground">{title || "Untitled"}</h1>
      {authorName ? (
        <p className="mt-2 text-sm text-muted-foreground">
          By <span className="text-foreground/90">{authorName}</span>
        </p>
      ) : null}
      <p className="mt-4 text-muted-foreground">{description}</p>
      <div
        className="prose prose-invert mt-8 max-w-none [&_h1]:mt-8 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-foreground [&_h2]:mt-8 [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:font-semibold [&_h3]:text-foreground [&_p]:text-foreground/90 [&_a]:text-primary [&_pre]:rounded-lg [&_pre]:bg-background [&_pre]:p-3"
        dangerouslySetInnerHTML={{ __html: safe }}
      />
    </article>
  );
}

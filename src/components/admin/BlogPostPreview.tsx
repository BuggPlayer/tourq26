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
    <article className="rounded-xl border border-slate-600 bg-[var(--background,#07090e)] p-6 text-left">
      <p className="text-sm text-slate-500">
        {date} · {readTime}
      </p>
      <h1 className="mt-2 font-display text-2xl font-bold text-white">{title || "Untitled"}</h1>
      {authorName ? (
        <p className="mt-2 text-sm text-slate-400">
          By <span className="text-white/90">{authorName}</span>
        </p>
      ) : null}
      <p className="mt-4 text-slate-400">{description}</p>
      <div
        className="prose prose-invert mt-8 max-w-none [&_h1]:mt-8 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-white [&_h2]:mt-8 [&_h2]:font-semibold [&_h2]:text-white [&_h3]:font-semibold [&_h3]:text-white [&_p]:text-slate-300 [&_a]:text-cyan-400 [&_pre]:rounded-lg [&_pre]:bg-slate-950 [&_pre]:p-3"
        dangerouslySetInnerHTML={{ __html: safe }}
      />
    </article>
  );
}

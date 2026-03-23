"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { BlogPost } from "@/lib/content";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { BlogEditorInsights } from "@/components/admin/BlogEditorInsights";
import { BlogPostPreview } from "@/components/admin/BlogPostPreview";

type Props = { post?: BlogPost };

type Tab = "write" | "preview" | "score";

export function BlogPostForm({ post }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("write");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [title, setTitle] = useState(post?.title ?? "");
  const [description, setDescription] = useState(post?.description ?? "");
  const [date, setDate] = useState(post?.date ?? new Date().toISOString().slice(0, 10));
  const [readTime, setReadTime] = useState(post?.readTime ?? "5 min read");
  const [authorName, setAuthorName] = useState(post?.authorName ?? "");
  const [body, setBody] = useState(post?.body ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    const url = post
      ? `/api/admin/content/blog/${encodeURIComponent(post.slug)}`
      : "/api/admin/content/blog";
    const method = post ? "PUT" : "POST";
    const payload = post
      ? { slug, title, description, date, readTime, body, authorName: authorName.trim() }
      : {
          slug: slug || undefined,
          title,
          description,
          date,
          readTime,
          body,
          authorName: authorName.trim() || undefined,
        };
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setError(data.error || "Save failed");
      return;
    }
    router.push("/admin/blog");
    router.refresh();
  };

  const tabBtn = (id: Tab, label: string) => (
    <button
      key={id}
      type="button"
      onClick={() => setTab(id)}
      className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
        tab === id
          ? "bg-cyan-600 text-white"
          : "text-slate-400 hover:bg-slate-800 hover:text-white"
      }`}
    >
      {label}
    </button>
  );

  return (
    <form onSubmit={handleSubmit} className="mt-6 max-w-4xl space-y-4">
      <div className="flex flex-wrap gap-2 border-b border-slate-700 pb-4">
        {tabBtn("write", "Write")}
        {tabBtn("preview", "Preview")}
        {tabBtn("score", "Content score")}
      </div>

      {tab === "write" && (
        <>
          <div>
            <label className="block text-sm font-medium text-slate-300">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-900/50 px-4 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="auto from title"
              className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-900/50 px-4 py-2 text-white placeholder:text-slate-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">Description (meta)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-900/50 px-4 py-2 text-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-900/50 px-4 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300">Read time</label>
              <input
                type="text"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                placeholder="5 min read"
                className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-900/50 px-4 py-2 text-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">
              Author name (optional, for SEO)
            </label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Defaults to site name if empty"
              className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-900/50 px-4 py-2 text-white placeholder:text-slate-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">Body</label>
            <p className="mt-0.5 text-xs text-slate-500">
              React Quill: H1–H3, lists, indent, blockquote, code blocks, links, alignment. Prefer one H1 per
              post (the page title is already an H1) — use H2/H3 for sections when possible.
            </p>
            <div className="mt-1">
              <RichTextEditor
                value={body}
                onChange={setBody}
                placeholder="Write your post…"
                minHeight="22rem"
              />
            </div>
          </div>
        </>
      )}

      {tab === "preview" && (
        <div className="rounded-xl border border-slate-700 bg-slate-950/50 p-4">
          <BlogPostPreview
            title={title}
            description={description}
            date={date}
            readTime={readTime}
            authorName={authorName.trim()}
            bodyHtml={body}
          />
        </div>
      )}

      {tab === "score" && (
        <BlogEditorInsights title={title} description={description} bodyHtml={body} />
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={saving}
        className="rounded-lg bg-cyan-600 px-6 py-2 font-medium text-white hover:bg-cyan-500 disabled:opacity-50"
      >
        {saving ? "Saving…" : post ? "Update post" : "Create post"}
      </button>
    </form>
  );
}

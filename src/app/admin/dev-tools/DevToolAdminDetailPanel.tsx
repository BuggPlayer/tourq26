"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import type { DevToolAdminOverride, DevToolsAdminDocument } from "@/lib/content";
import { applyDevToolOverridePatch } from "@/lib/dev-tool-admin-override-merge";
import { getFaqHtmlForAdminForm } from "@/lib/dev-tool-editorial";
import { DEV_TOOL_CATEGORY_LABELS, type UmbrellaTool } from "@/lib/umbrella-tools/tools-config";

type Props = {
  slug: string;
  tool: UmbrellaTool;
  initialOverrides: Record<string, DevToolAdminOverride>;
  initialUpdatedAt: string;
};

export function DevToolAdminDetailPanel({ slug, tool, initialOverrides, initialUpdatedAt }: Props) {
  const [overrides, setOverrides] = useState<Record<string, DevToolAdminOverride>>(initialOverrides);
  const [updatedAt, setUpdatedAt] = useState(initialUpdatedAt);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const load = useCallback(async () => {
    setMessage(null);
    try {
      const res = await fetch("/api/admin/dev-tools");
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Load failed");
      const doc = data.document as DevToolsAdminDocument;
      setOverrides(doc?.overrides ?? {});
      setUpdatedAt(doc?.updatedAt ?? "");
    } catch (e) {
      setMessage({ type: "err", text: e instanceof Error ? e.message : "Load failed" });
    }
  }, []);

  const o = overrides[slug] ?? {};
  const enabled = o.enabled !== false;
  const faqBody = getFaqHtmlForAdminForm(o);

  function setOverride(patch: Partial<DevToolAdminOverride>) {
    setOverrides((prev) => applyDevToolOverridePatch(prev, slug, patch));
  }

  async function save() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/dev-tools", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ overrides }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Save failed");
      setOverrides(data.document?.overrides ?? overrides);
      setUpdatedAt(data.document?.updatedAt ?? new Date().toISOString());
      setMessage({ type: "ok", text: "Saved. Hub, sitemap, and public URLs update on the next request." });
    } catch (e) {
      setMessage({ type: "err", text: e instanceof Error ? e.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  }

  function resetRow() {
    setOverrides((prev) => {
      const next = { ...prev };
      delete next[slug];
      return next;
    });
  }

  const previewSrc = `/dev-tools/${slug}?adminPreview=1`;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <Link
          href="/admin/dev-tools"
          className="font-medium text-muted-foreground hover:text-foreground"
        >
          ← All dev tools
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="font-mono text-foreground">{slug}</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-foreground">{tool.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {DEV_TOOL_CATEGORY_LABELS[tool.category]} · Registry-defined tool; admin overrides apply at runtime.
        </p>
        {updatedAt ? (
          <p className="mt-2 text-xs text-muted-foreground">Last document update: {new Date(updatedAt).toLocaleString()}</p>
        ) : null}
      </div>

      <section className="mt-6 max-w-4xl space-y-4">
        <div className="flex flex-wrap gap-2 border-b border-border pb-4">
          <span className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-foreground">FAQ</span>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground/90">Public FAQ</label>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Same editor as blog posts: headings, lists, quotes, code blocks, links, alignment. Shown on the live tool
            page below the interactive UI. The structured FAQ from code (
            <code className="rounded bg-muted px-1 font-mono text-xs">DevToolsToolFaq</code>) still appears underneath.
            Saving here stores <code className="rounded bg-muted px-1 font-mono text-[11px]">faqHtml</code> and clears
            older multi-section editorial data.
          </p>
          <div className="mt-2">
            <RichTextEditor
              value={faqBody}
              onChange={(html) => setOverride({ faqHtml: html })}
              placeholder="Write FAQ content for this tool…"
              minHeight="22rem"
            />
          </div>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,22rem)_1fr] lg:items-start">
        <div className="space-y-4 rounded-xl border border-border/50 bg-muted/20 p-5">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">Overrides</h2>
          {message && (
            <p className={message.type === "ok" ? "text-sm text-success" : "text-sm text-destructive"}>{message.text}</p>
          )}
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setOverride({ enabled: e.target.checked })}
            />
            <span className="text-sm font-medium text-foreground">Enabled (public)</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={!!o.featured}
              onChange={(e) => setOverride({ featured: e.target.checked })}
            />
            <span className="text-sm font-medium text-foreground">Featured on hub</span>
          </label>
          <div>
            <label htmlFor="dev-tool-notes" className="text-sm font-medium text-foreground">
              Operator notes
            </label>
            <textarea
              id="dev-tool-notes"
              value={o.notes ?? ""}
              onChange={(e) => setOverride({ notes: e.target.value })}
              rows={5}
              placeholder="Internal notes…"
              className="mt-1 w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-hover disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
            <button
              type="button"
              onClick={resetRow}
              className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-muted"
            >
              Reset row
            </button>
            <button type="button" onClick={load} className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-muted">
              Reload from server
            </button>
          </div>
          <div className="border-t border-border/40 pt-4 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">Public links</p>
            <a
              href={enabled ? `/dev-tools/${slug}` : previewSrc}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block font-medium text-primary hover:underline"
            >
              {enabled ? "Open live tool page" : "Open admin preview (disabled)"}
            </a>
            {!enabled ? (
              <p className="mt-2">
                This tool is disabled for visitors (404). Use preview below or the link above with{" "}
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">?adminPreview=1</code> while signed
                in as admin.
              </p>
            ) : null}
          </div>
        </div>

        <div className="min-h-0 space-y-4">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">Live preview</h2>
          <p className="text-xs text-muted-foreground">
            Embedded view uses admin preview so you can verify the tool even when it is disabled for the public.
          </p>
          <div className="overflow-hidden rounded-xl border border-border/60 bg-background shadow-inner">
            <iframe
              title={`Preview: ${tool.title}`}
              src={previewSrc}
              className="h-[min(72vh,880px)] w-full border-0 bg-background"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border/40 bg-muted/15 p-5">
        <h3 className="font-display text-sm font-semibold text-foreground">Registry description</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{tool.description}</p>
        <p className="mt-4 font-mono text-xs text-muted-foreground">
          Slug: {tool.slug} · Category: {tool.category}
        </p>
      </div>
    </div>
  );
}

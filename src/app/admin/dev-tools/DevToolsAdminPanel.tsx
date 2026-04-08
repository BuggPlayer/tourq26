"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { DevToolAdminOverride, DevToolsAdminDocument } from "@/lib/content";
import { applyDevToolOverridePatch } from "@/lib/dev-tool-admin-override-merge";
import { resolveHubSlugOrderForCategory } from "@/lib/dev-tools-admin";
import { DEV_TOOL_CATEGORY_LABELS, type DevToolCategory } from "@/lib/umbrella-tools/tools-config";

function hubOrderDocStub(hub: Partial<Record<DevToolCategory, string[]>>): DevToolsAdminDocument {
  return { overrides: {}, hubSlugOrderByCategory: hub, updatedAt: "" };
}

type CatalogRow = {
  slug: string;
  title: string;
  description: string;
  category: DevToolCategory;
  icon: string;
};

export function DevToolsAdminPanel() {
  const [catalog, setCatalog] = useState<CatalogRow[]>([]);
  const [overrides, setOverrides] = useState<Record<string, DevToolAdminOverride>>({});
  const [hubSlugOrderByCategory, setHubSlugOrderByCategory] = useState<
    Partial<Record<DevToolCategory, string[]>>
  >({});
  const [updatedAt, setUpdatedAt] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const hubOrderTouchedRef = useRef(false);

  const load = useCallback(async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/dev-tools");
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Load failed");
      setCatalog(data.catalog ?? []);
      const doc = data.document as DevToolsAdminDocument;
      setOverrides(doc?.overrides ?? {});
      setHubSlugOrderByCategory(doc?.hubSlugOrderByCategory ?? {});
      hubOrderTouchedRef.current = false;
      setUpdatedAt(doc?.updatedAt ?? "");
    } catch (e) {
      setMessage({ type: "err", text: e instanceof Error ? e.message : "Load failed" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const categories = useMemo(() => {
    const s = new Set<string>();
    for (const r of catalog) s.add(r.category);
    return [...s].sort();
  }, [catalog]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return catalog.filter((row) => {
      if (categoryFilter !== "all" && row.category !== categoryFilter) return false;
      if (!q) return true;
      return (
        row.slug.includes(q) ||
        row.title.toLowerCase().includes(q) ||
        row.description.toLowerCase().includes(q)
      );
    });
  }, [catalog, search, categoryFilter]);

  const stats = useMemo(() => {
    let enabled = 0;
    let disabled = 0;
    for (const row of catalog) {
      if (overrides[row.slug]?.enabled === false) disabled++;
      else enabled++;
    }
    return { enabled, disabled, total: catalog.length };
  }, [catalog, overrides]);

  function setOverride(slug: string, patch: Partial<DevToolAdminOverride>) {
    setOverrides((prev) => applyDevToolOverridePatch(prev, slug, patch));
  }

  async function save() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/dev-tools", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          hubOrderTouchedRef.current ? { overrides, hubSlugOrderByCategory } : { overrides },
        ),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Save failed");
      setOverrides(data.document?.overrides ?? overrides);
      setHubSlugOrderByCategory(data.document?.hubSlugOrderByCategory ?? hubSlugOrderByCategory);
      hubOrderTouchedRef.current = false;
      setUpdatedAt(data.document?.updatedAt ?? new Date().toISOString());
      setMessage({ type: "ok", text: "Saved. Hub, tool pages, and sitemap will reflect changes on the next request." });
    } catch (e) {
      setMessage({ type: "err", text: e instanceof Error ? e.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  }

  function resetRow(slug: string) {
    setOverrides((prev) => {
      const next = { ...prev };
      delete next[slug];
      return next;
    });
  }

  function moveSlugInCategory(category: DevToolCategory, slug: string, delta: -1 | 1) {
    hubOrderTouchedRef.current = true;
    setHubSlugOrderByCategory((prev) => {
      const order = resolveHubSlugOrderForCategory(category, hubOrderDocStub(prev));
      const i = order.indexOf(slug);
      const j = i + delta;
      if (i < 0 || j < 0 || j >= order.length) return prev;
      const nextOrder = [...order];
      [nextOrder[i], nextOrder[j]] = [nextOrder[j], nextOrder[i]];
      return { ...prev, [category]: nextOrder };
    });
  }

  if (loading) {
    return <p className="text-muted-foreground">Loading developer tools catalog…</p>;
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Total in registry</p>
          <p className="mt-1 font-display text-2xl font-bold text-foreground">{stats.total}</p>
        </div>
        <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Enabled</p>
          <p className="mt-1 font-display text-2xl font-bold text-success">{stats.enabled}</p>
        </div>
        <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Disabled (hidden)</p>
          <p className="mt-1 font-display text-2xl font-bold text-destructive">{stats.disabled}</p>
        </div>
      </div>

      {updatedAt ? (
        <p className="text-xs text-muted-foreground">
          Last document update: {new Date(updatedAt).toLocaleString()}
        </p>
      ) : null}

      <p className="text-sm text-muted-foreground">
        Tools are defined in code (registry). Here you can <strong className="text-foreground">disable</strong> a tool
        (removes it from the hub, related tools, and sitemap; direct URLs return 404), add operator{" "}
        <strong className="text-foreground">notes</strong>, mark{" "}
        <strong className="text-foreground">featured</strong> (badge + listed before non-featured in each category),
        and <strong className="text-foreground">move</strong> tools up or down within their category (hub + sidebar
        order; featured items still appear above non-featured). Open a tool&apos;s{" "}
        <strong className="text-foreground">detail page</strong> for a full preview and editorial controls. Changes
        persist in Vercel KV (production) or <code className="text-primary/90">content/dev-tools-admin.json</code>{" "}
        locally.
      </p>

      {message && (
        <p className={message.type === "ok" ? "text-sm text-success" : "text-sm text-destructive"}>{message.text}</p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <label htmlFor="dev-tools-search" className="text-sm font-medium text-foreground">
            Search
          </label>
          <input
            id="dev-tools-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Slug, title, description…"
            className="mt-1 w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-foreground"
          />
        </div>
        <div>
          <label htmlFor="dev-tools-cat" className="text-sm font-medium text-foreground">
            Category
          </label>
          <select
            id="dev-tools-cat"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="mt-1 w-full min-w-[10rem] rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-foreground sm:w-auto"
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {DEV_TOOL_CATEGORY_LABELS[c as DevToolCategory]}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border/50">
        <table className="w-full min-w-[820px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border/60 bg-muted/40">
              <th className="px-3 py-3 font-semibold text-foreground">Tool</th>
              <th className="px-3 py-3 font-semibold text-foreground">Category</th>
              <th className="px-3 py-3 font-semibold text-foreground">Order</th>
              <th className="px-3 py-3 font-semibold text-foreground">Enabled</th>
              <th className="px-3 py-3 font-semibold text-foreground">Featured</th>
              <th className="px-3 py-3 font-semibold text-foreground">Notes</th>
              <th className="px-3 py-3 font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => {
              const o = overrides[row.slug] ?? {};
              const enabled = o.enabled !== false;
              const cat = row.category as DevToolCategory;
              const order = resolveHubSlugOrderForCategory(cat, hubOrderDocStub(hubSlugOrderByCategory));
              const pos = order.indexOf(row.slug);
              const canUp = pos > 0;
              const canDown = pos >= 0 && pos < order.length - 1;
              return (
                <tr key={row.slug} className="border-b border-border/40 hover:bg-muted/20">
                  <td className="px-3 py-3 align-top">
                    <div className="flex items-start gap-2">
                      <span className="font-mono text-primary/70" aria-hidden>
                        {row.icon}
                      </span>
                      <div>
                        <div className="font-medium text-foreground">{row.title}</div>
                        <div className="mt-0.5 font-mono text-xs text-muted-foreground">{row.slug}</div>
                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{row.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 align-top text-xs text-muted-foreground">
                    {DEV_TOOL_CATEGORY_LABELS[row.category]}
                  </td>
                  <td className="px-3 py-3 align-top">
                    <div className="flex flex-col gap-1">
                      <div className="flex gap-1">
                        <button
                          type="button"
                          disabled={!canUp}
                          title="Move up in category (hub & sidebar)"
                          aria-label={`Move ${row.title} up in category`}
                          onClick={() => moveSlugInCategory(cat, row.slug, -1)}
                          className="rounded border border-border bg-muted/40 px-2 py-0.5 text-xs font-medium text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Up
                        </button>
                        <button
                          type="button"
                          disabled={!canDown}
                          title="Move down in category (hub & sidebar)"
                          aria-label={`Move ${row.title} down in category`}
                          onClick={() => moveSlugInCategory(cat, row.slug, 1)}
                          className="rounded border border-border bg-muted/40 px-2 py-0.5 text-xs font-medium text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Down
                        </button>
                      </div>
                      <span className="text-[10px] text-muted-foreground">Within {DEV_TOOL_CATEGORY_LABELS[cat]}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 align-top">
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={enabled}
                        onChange={(e) => setOverride(row.slug, { enabled: e.target.checked })}
                      />
                      <span className="text-xs">{enabled ? "On" : "Off"}</span>
                    </label>
                  </td>
                  <td className="px-3 py-3 align-top">
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={!!o.featured}
                        onChange={(e) => setOverride(row.slug, { featured: e.target.checked })}
                      />
                    </label>
                  </td>
                  <td className="max-w-[220px] px-3 py-3 align-top">
                    <textarea
                      value={o.notes ?? ""}
                      onChange={(e) => setOverride(row.slug, { notes: e.target.value })}
                      rows={2}
                      placeholder="Internal notes…"
                      className="w-full resize-y rounded border border-border bg-background px-2 py-1 text-xs text-foreground"
                    />
                  </td>
                  <td className="px-3 py-3 align-top">
                    <div className="flex flex-col gap-1">
                      <a
                        href={`/admin/dev-tools/${row.slug}`}
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        Detail & preview
                      </a>
                      <a
                        href={`/dev-tools/${row.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-muted-foreground hover:text-primary hover:underline"
                      >
                        View live
                      </a>
                      <button
                        type="button"
                        onClick={() => resetRow(row.slug)}
                        className="text-left text-xs text-muted-foreground hover:text-foreground"
                      >
                        Reset row
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 ? <p className="text-sm text-muted-foreground">No tools match your filters.</p> : null}
    </div>
  );
}

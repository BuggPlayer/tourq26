"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SiteContent } from "@/lib/content";

export function SiteForm({ initialData }: { initialData: SiteContent }) {
  const router = useRouter();
  const [data, setData] = useState(initialData);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const update = <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const save = async () => {
    setError("");
    setSaving(true);
    const res = await fetch("/api/admin/content/site", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSaving(false);
    if (!res.ok) {
      setError("Save failed");
      return;
    }
    router.refresh();
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); save(); }} className="mt-6 max-w-2xl space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-300">Site URL</label>
        <input
          type="url"
          value={data.siteUrl}
          onChange={(e) => update("siteUrl", e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-900/50 px-4 py-2 text-white"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300">Default title</label>
        <input
          type="text"
          value={data.defaultTitle}
          onChange={(e) => update("defaultTitle", e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-900/50 px-4 py-2 text-white"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300">Default description</label>
        <textarea
          value={data.defaultDescription}
          onChange={(e) => update("defaultDescription", e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-900/50 px-4 py-2 text-white"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300">Title template (%s = page title)</label>
        <input
          type="text"
          value={data.titleTemplate}
          onChange={(e) => update("titleTemplate", e.target.value)}
          placeholder="%s | Torq Studio"
          className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-900/50 px-4 py-2 text-white"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300">OG title</label>
        <input
          type="text"
          value={data.ogTitle}
          onChange={(e) => update("ogTitle", e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-900/50 px-4 py-2 text-white"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300">OG description</label>
        <textarea
          value={data.ogDescription}
          onChange={(e) => update("ogDescription", e.target.value)}
          rows={2}
          className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-900/50 px-4 py-2 text-white"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300">Keywords (one per line or comma-separated)</label>
        <textarea
          value={Array.isArray(data.keywords) ? data.keywords.join("\n") : ""}
          onChange={(e) =>
            update(
              "keywords",
              e.target.value
                .split(/\n|,/)
                .map((k) => k.trim())
                .filter(Boolean)
            )
          }
          rows={4}
          className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-900/50 px-4 py-2 text-white"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300">Site name</label>
        <input
          type="text"
          value={data.siteName}
          onChange={(e) => update("siteName", e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-900/50 px-4 py-2 text-white"
        />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={saving}
        className="rounded-lg bg-cyan-600 px-6 py-2 font-medium text-white hover:bg-cyan-500 disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save site & SEO"}
      </button>
    </form>
  );
}

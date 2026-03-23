"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Cat = { id: string; slug: string; label: string; sortOrder: number };

export function InterviewBankCategoriesClient({
  bankSlug,
  initialCategories,
}: {
  bankSlug: string;
  initialCategories: Cat[];
}) {
  const router = useRouter();
  const enc = encodeURIComponent(bankSlug);
  const [slug, setSlug] = useState("");
  const [label, setLabel] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy("add");
    const res = await fetch(`/api/admin/hub/banks/${enc}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: slug.trim(), label: label.trim() }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(null);
    if (!res.ok) {
      setError(data.error?.message ?? JSON.stringify(data.error) ?? "Failed");
      return;
    }
    setSlug("");
    setLabel("");
    router.refresh();
  }

  async function remove(slugVal: string) {
    if (!window.confirm(`Delete category ${slugVal} and all its questions?`)) return;
    setBusy(slugVal);
    const res = await fetch(
      `/api/admin/hub/banks/${enc}/categories/${encodeURIComponent(slugVal)}`,
      { method: "DELETE" },
    );
    setBusy(null);
    if (res.ok) router.refresh();
    else alert("Delete failed (may have dependency issues)");
  }

  return (
    <div className="mt-6 space-y-8">
      <form onSubmit={add} className="max-w-md space-y-3 rounded-xl border border-slate-700/50 p-4">
        <h2 className="font-semibold text-white">Add category</h2>
        <p className="text-xs text-slate-500">Slug: lowercase letters, numbers, hyphens only.</p>
        <input
          className="w-full rounded-lg border border-slate-600 bg-slate-900/50 px-3 py-2 text-white"
          placeholder="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
        />
        <input
          className="w-full rounded-lg border border-slate-600 bg-slate-900/50 px-3 py-2 text-white"
          placeholder="Label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          required
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={busy === "add"}
          className="rounded-lg bg-cyan-600 px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          Add
        </button>
      </form>

      <ul className="space-y-2">
        {initialCategories.map((c) => (
          <li
            key={c.id}
            className="flex items-center justify-between rounded-lg border border-slate-700/50 bg-slate-800/30 px-4 py-3"
          >
            <div>
              <span className="font-mono text-cyan-400/90">{c.slug}</span>
              <span className="ml-3 text-slate-200">{c.label}</span>
              <span className="ml-2 text-xs text-slate-500">order {c.sortOrder}</span>
            </div>
            <button
              type="button"
              disabled={busy === c.slug}
              onClick={() => remove(c.slug)}
              className="text-sm text-red-400 hover:underline disabled:opacity-50"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Tag = { id: string; name: string; category: string };

export function CompanyTagsClient({ initialTags }: { initialTags: Tag[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("FAANG");
  const [busy, setBusy] = useState(false);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await fetch("/api/admin/hub/company-tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), category: category.trim() }),
    });
    setBusy(false);
    if (res.ok) {
      setName("");
      router.refresh();
    } else alert("Failed (duplicate name?)");
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this tag? Questions may lose the link.")) return;
    const res = await fetch(`/api/admin/hub/company-tags/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
    else alert("Delete failed");
  }

  return (
    <div className="mt-6 space-y-6">
      <form onSubmit={add} className="flex max-w-xl flex-wrap items-end gap-3">
        <div className="min-w-[140px] flex-1">
          <label className="block text-xs text-slate-500">Name</label>
          <input
            className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-900/50 px-3 py-2 text-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="min-w-[120px] flex-1">
          <label className="block text-xs text-slate-500">Category</label>
          <input
            className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-900/50 px-3 py-2 text-white"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-cyan-600 px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          Add
        </button>
      </form>
      <ul className="divide-y divide-slate-800 rounded-xl border border-slate-700/50">
        {initialTags.map((t) => (
          <li key={t.id} className="flex items-center justify-between px-4 py-3">
            <div>
              <span className="font-medium text-white">{t.name}</span>
              <span className="ml-3 text-sm text-slate-500">{t.category}</span>
            </div>
            <button
              type="button"
              onClick={() => remove(t.id)}
              className="text-sm text-red-400 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

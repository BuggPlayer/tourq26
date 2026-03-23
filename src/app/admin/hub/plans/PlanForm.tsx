"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Initial = {
  slug: string;
  name: string;
  description: string;
  durationDays: number;
  milestones: string;
  sortOrder: number;
};

const input =
  "mt-1 w-full rounded-lg border border-slate-600 bg-slate-900/50 px-4 py-2 text-white placeholder:text-slate-500";
const label = "block text-sm font-medium text-slate-300";

export function PlanForm({ initial }: { initial?: Initial }) {
  const router = useRouter();
  const edit = !!initial;
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [durationDays, setDurationDays] = useState(String(initial?.durationDays ?? 7));
  const [milestones, setMilestones] = useState(
    initial?.milestones ?? '[{"id":"m1","title":"Week 1","questionCount":5}]',
  );
  const [sortOrder, setSortOrder] = useState(String(initial?.sortOrder ?? 0));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const payload = {
      name,
      description,
      durationDays: Number.parseInt(durationDays, 10) || 1,
      milestones,
      sortOrder: Number.parseInt(sortOrder, 10) || 0,
    };
    const url = edit
      ? `/api/admin/hub/plans/${encodeURIComponent(initial!.slug)}`
      : "/api/admin/hub/plans";
    const method = edit ? "PUT" : "POST";
    const body = edit ? payload : { ...payload, slug };
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setError(typeof data.error === "string" ? data.error : "Save failed");
      return;
    }
    router.push("/admin/hub/plans");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="mt-6 max-w-2xl space-y-4">
      {!edit && (
        <div>
          <label className={label}>Slug</label>
          <input className={input} value={slug} onChange={(e) => setSlug(e.target.value)} required />
        </div>
      )}
      <div>
        <label className={label}>Name</label>
        <input className={input} value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label className={label}>Description</label>
        <textarea
          className={input}
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>Duration (days)</label>
          <input
            className={input}
            type="number"
            min={1}
            value={durationDays}
            onChange={(e) => setDurationDays(e.target.value)}
            required
          />
        </div>
        <div>
          <label className={label}>Sort order</label>
          <input
            className={input}
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          />
        </div>
      </div>
      <div>
        <label className={label}>Milestones (JSON array)</label>
        <textarea
          className={`${input} font-mono text-xs`}
          rows={8}
          value={milestones}
          onChange={(e) => setMilestones(e.target.value)}
          required
        />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={saving}
        className="rounded-lg bg-cyan-600 px-6 py-2 font-medium text-white hover:bg-cyan-500 disabled:opacity-50"
      >
        {saving ? "Saving…" : edit ? "Update" : "Create"}
      </button>
    </form>
  );
}

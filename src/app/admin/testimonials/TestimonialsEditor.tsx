"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Testimonial } from "@/lib/content";

export function TestimonialsEditor({ initialItems }: { initialItems: Testimonial[] }) {
  const router = useRouter();
  const [items, setItems] = useState<Testimonial[]>(initialItems);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const update = (index: number, field: keyof Testimonial, value: string | number) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const add = () => {
    setItems((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        quote: "",
        result: "",
        name: "",
        role: "",
        company: "",
        rating: 5,
      },
    ]);
  };

  const remove = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const save = async () => {
    setError("");
    setSaving(true);
    const res = await fetch("/api/admin/content/testimonials", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(items),
    });
    setSaving(false);
    if (!res.ok) {
      setError("Save failed");
      return;
    }
    router.refresh();
  };

  return (
    <div className="mt-6 space-y-6">
      {items.map((item, index) => (
        <div
          key={item.id}
          className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4 space-y-3"
        >
          <div className="flex justify-between">
            <span className="text-sm text-slate-500">#{index + 1}</span>
            <button
              type="button"
              onClick={() => remove(index)}
              className="text-sm text-red-400 hover:text-red-300"
            >
              Remove
            </button>
          </div>
          <div>
            <label className="block text-sm text-slate-400">Quote</label>
            <textarea
              value={item.quote}
              onChange={(e) => update(index, "quote", e.target.value)}
              rows={2}
              className="mt-1 w-full rounded border border-slate-600 bg-slate-900/50 px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400">Result tag</label>
            <input
              type="text"
              value={item.result}
              onChange={(e) => update(index, "result", e.target.value)}
              placeholder="On time, under budget"
              className="mt-1 w-full rounded border border-slate-600 bg-slate-900/50 px-3 py-2 text-white"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm text-slate-400">Name</label>
              <input
                type="text"
                value={item.name}
                onChange={(e) => update(index, "name", e.target.value)}
                className="mt-1 w-full rounded border border-slate-600 bg-slate-900/50 px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400">Role</label>
              <input
                type="text"
                value={item.role}
                onChange={(e) => update(index, "role", e.target.value)}
                className="mt-1 w-full rounded border border-slate-600 bg-slate-900/50 px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400">Company</label>
              <input
                type="text"
                value={item.company}
                onChange={(e) => update(index, "company", e.target.value)}
                className="mt-1 w-full rounded border border-slate-600 bg-slate-900/50 px-3 py-2 text-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-slate-400">Rating (1–5)</label>
            <input
              type="number"
              min={1}
              max={5}
              value={item.rating}
              onChange={(e) => update(index, "rating", parseInt(e.target.value, 10) || 5)}
              className="mt-1 w-20 rounded border border-slate-600 bg-slate-900/50 px-3 py-2 text-white"
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="rounded-lg border border-dashed border-slate-600 px-4 py-3 text-sm text-slate-400 hover:border-cyan-500 hover:text-cyan-400"
      >
        + Add testimonial
      </button>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="rounded-lg bg-cyan-600 px-6 py-2 font-medium text-white hover:bg-cyan-500 disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save all testimonials"}
      </button>
    </div>
  );
}

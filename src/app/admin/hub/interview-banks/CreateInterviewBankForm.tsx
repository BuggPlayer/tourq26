"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const input =
  "mt-1 w-full rounded-lg border border-slate-600 bg-slate-900/50 px-4 py-2 text-white placeholder:text-slate-500";
const label = "block text-sm font-medium text-slate-300";

export function CreateInterviewBankForm() {
  const router = useRouter();
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const res = await fetch("/api/admin/hub/banks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: slug.trim(),
        label: title.trim(),
        description: description.trim() || null,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setError(typeof data.error === "string" ? data.error : "Create failed");
      return;
    }
    const s = slug.trim();
    router.push(`/admin/hub/interview-banks/${encodeURIComponent(s)}`);
    router.refresh();
  }

  return (
    <form
      onSubmit={submit}
      className="mt-6 max-w-lg space-y-4 rounded-xl border border-slate-700/50 p-4"
    >
      <h2 className="font-semibold text-white">New bank</h2>
      <p className="text-xs text-slate-500">
        Slug becomes the public URL: <code className="text-cyan-400/90">/hub/candidate/interview/your-slug</code>
      </p>
      <div>
        <label className={label}>Slug</label>
        <input
          className={input}
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
          pattern="[a-z0-9-]+"
          placeholder="e.g. react"
        />
      </div>
      <div>
        <label className={label}>Title</label>
        <input
          className={input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="e.g. React interview"
        />
      </div>
      <div>
        <label className={label}>Description (optional)</label>
        <textarea
          className={input}
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      <button
        type="submit"
        disabled={busy}
        className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-500 disabled:opacity-50"
      >
        {busy ? "Creating…" : "Create bank"}
      </button>
    </form>
  );
}

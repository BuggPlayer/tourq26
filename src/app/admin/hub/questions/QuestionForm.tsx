"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Tag = { id: string; name: string; category: string };

const Q_TYPES = ["DSA", "UI", "QUIZ", "FRONTEND_SYSTEM_DESIGN"] as const;

type Initial = {
  id: string;
  type: (typeof Q_TYPES)[number];
  title: string;
  description: string;
  difficulty: string;
  topic: string;
  framework: string;
  defaultLanguage: string;
  starterCode: string;
  tests: string;
  officialSolution: string;
  systemDesignMeta: string;
  companyTagNames: string[];
};

const input =
  "mt-1 w-full rounded-lg border border-slate-600 bg-slate-900/50 px-4 py-2 text-white placeholder:text-slate-500";
const label = "block text-sm font-medium text-slate-300";

export function QuestionForm({
  companyTags,
  initial,
}: {
  companyTags: Tag[];
  initial?: Initial;
}) {
  const router = useRouter();
  const edit = !!initial;
  const [type, setType] = useState<(typeof Q_TYPES)[number]>(initial?.type ?? "DSA");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [difficulty, setDifficulty] = useState(initial?.difficulty ?? "Medium");
  const [topic, setTopic] = useState(initial?.topic ?? "");
  const [framework, setFramework] = useState(initial?.framework ?? "");
  const [defaultLanguage, setDefaultLanguage] = useState(initial?.defaultLanguage ?? "");
  const [starterCode, setStarterCode] = useState(initial?.starterCode ?? "");
  const [tests, setTests] = useState(initial?.tests ?? "");
  const [officialSolution, setOfficialSolution] = useState(initial?.officialSolution ?? "");
  const [systemDesignMeta, setSystemDesignMeta] = useState(initial?.systemDesignMeta ?? "");
  const [tagCsv, setTagCsv] = useState((initial?.companyTagNames ?? []).join(", "));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function parseTags(): string[] {
    return tagCsv
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const companyTagNames = parseTags();
    const payload = {
      type,
      title,
      description,
      difficulty,
      topic,
      framework: framework || null,
      defaultLanguage: defaultLanguage || null,
      starterCode: starterCode || null,
      tests: tests || null,
      officialSolution: officialSolution || null,
      systemDesignMeta: systemDesignMeta || null,
      companyTagNames,
    };
    const url = edit
      ? `/api/admin/hub/questions/${initial!.id}`
      : "/api/admin/hub/questions";
    const method = edit ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setError(typeof data.error === "string" ? data.error : "Save failed");
      return;
    }
    router.push("/admin/hub/questions");
    router.refresh();
  }

  async function remove() {
    if (!edit || !window.confirm("Delete this question?")) return;
    setSaving(true);
    const res = await fetch(`/api/admin/hub/questions/${initial!.id}`, { method: "DELETE" });
    setSaving(false);
    if (res.ok) {
      router.push("/admin/hub/questions");
      router.refresh();
    } else alert("Delete failed");
  }

  return (
    <form onSubmit={submit} className="mt-6 max-w-3xl space-y-4">
      <div>
        <label className={label}>Type</label>
        <select className={input} value={type} onChange={(e) => setType(e.target.value as (typeof Q_TYPES)[number])}>
          {Q_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className={label}>Title</label>
        <input className={input} value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div>
        <label className={label}>Description</label>
        <textarea
          className={input}
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>Difficulty</label>
          <input className={input} value={difficulty} onChange={(e) => setDifficulty(e.target.value)} required />
        </div>
        <div>
          <label className={label}>Topic</label>
          <input className={input} value={topic} onChange={(e) => setTopic(e.target.value)} required />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>Framework (UI / FSD)</label>
          <input
            className={input}
            value={framework}
            onChange={(e) => setFramework(e.target.value)}
            placeholder="react, vanilla, …"
          />
        </div>
        <div>
          <label className={label}>Default language</label>
          <input
            className={input}
            value={defaultLanguage}
            onChange={(e) => setDefaultLanguage(e.target.value)}
            placeholder="javascript"
          />
        </div>
      </div>
      <div>
        <label className={label}>Company tags (comma-separated names)</label>
        <input
          className={input}
          value={tagCsv}
          onChange={(e) => setTagCsv(e.target.value)}
          placeholder="Google, Meta"
        />
        <p className="mt-1 text-xs text-slate-500">
          Known: {companyTags.map((t) => t.name).join(", ") || "— add tags first"}
        </p>
      </div>
      <div>
        <label className={label}>Starter code (JSON string)</label>
        <textarea
          className={`${input} font-mono text-xs`}
          rows={6}
          value={starterCode}
          onChange={(e) => setStarterCode(e.target.value)}
        />
      </div>
      <div>
        <label className={label}>Tests (JSON string)</label>
        <textarea className={`${input} font-mono text-xs`} rows={4} value={tests} onChange={(e) => setTests(e.target.value)} />
      </div>
      <div>
        <label className={label}>Official solution (markdown/text)</label>
        <textarea
          className={input}
          rows={4}
          value={officialSolution}
          onChange={(e) => setOfficialSolution(e.target.value)}
        />
      </div>
      <div>
        <label className={label}>System design meta (JSON)</label>
        <textarea
          className={`${input} font-mono text-xs`}
          rows={4}
          value={systemDesignMeta}
          onChange={(e) => setSystemDesignMeta(e.target.value)}
        />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-cyan-600 px-6 py-2 font-medium text-white hover:bg-cyan-500 disabled:opacity-50"
        >
          {saving ? "Saving…" : edit ? "Update" : "Create"}
        </button>
        {edit && (
          <button
            type="button"
            disabled={saving}
            onClick={remove}
            className="rounded-lg border border-red-900/50 px-6 py-2 text-red-400 hover:bg-red-950/30 disabled:opacity-50"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
}

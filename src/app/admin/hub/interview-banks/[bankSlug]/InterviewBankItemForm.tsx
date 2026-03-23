"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Cat = { id: string; slug: string; label: string };

type Initial = {
  publicId: string;
  categorySlug: string;
  question: string;
  answer: string;
  difficulty: string;
  categoryBadge: string;
  answerIntro: string;
  bulletsJson: string;
  codeExample: string;
  sourceName: string;
  sourceUrl: string;
  sortOrder: number;
};

type Props = {
  bankSlug: string;
  categories: Cat[];
  initial?: Initial;
};

const input =
  "mt-1 w-full rounded-lg border border-slate-600 bg-slate-900/50 px-4 py-2 text-white placeholder:text-slate-500";
const label = "block text-sm font-medium text-slate-300";

export function InterviewBankItemForm({ bankSlug, categories, initial }: Props) {
  const router = useRouter();
  const edit = !!initial;
  const enc = encodeURIComponent(bankSlug);
  const [publicId, setPublicId] = useState(initial?.publicId ?? "");
  const [categorySlug, setCategorySlug] = useState(
    initial?.categorySlug ?? categories[0]?.slug ?? "",
  );
  const [question, setQuestion] = useState(initial?.question ?? "");
  const [answer, setAnswer] = useState(initial?.answer ?? "");
  const [difficulty, setDifficulty] = useState(initial?.difficulty ?? "");
  const [categoryBadge, setCategoryBadge] = useState(initial?.categoryBadge ?? "");
  const [answerIntro, setAnswerIntro] = useState(initial?.answerIntro ?? "");
  const [bulletsJson, setBulletsJson] = useState(initial?.bulletsJson ?? "");
  const [codeExample, setCodeExample] = useState(initial?.codeExample ?? "");
  const [sourceName, setSourceName] = useState(initial?.sourceName ?? "");
  const [sourceUrl, setSourceUrl] = useState(initial?.sourceUrl ?? "");
  const [sortOrder, setSortOrder] = useState(String(initial?.sortOrder ?? 0));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const payload = {
      categorySlug,
      question,
      answer,
      difficulty: difficulty || null,
      categoryBadge: categoryBadge || null,
      answerIntro: answerIntro || null,
      bulletsJson: bulletsJson.trim() || null,
      codeExample: codeExample || null,
      sourceName: sourceName || null,
      sourceUrl: sourceUrl || null,
      sortOrder: Number.parseInt(sortOrder, 10) || 0,
    };
    const url = edit
      ? `/api/admin/hub/banks/${enc}/items/${encodeURIComponent(initial!.publicId)}`
      : `/api/admin/hub/banks/${enc}/items`;
    const method = edit ? "PUT" : "POST";
    const body = edit ? payload : { ...payload, publicId };
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
    router.push(`/admin/hub/interview-banks/${enc}`);
    router.refresh();
  }

  if (categories.length === 0) {
    return (
      <p className="mt-6 text-amber-400">
        No categories yet.{" "}
        <a href={`/admin/hub/interview-banks/${enc}/categories`} className="underline">
          Create categories first
        </a>
        .
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="mt-6 max-w-3xl space-y-4">
      {!edit && (
        <div>
          <label className={label}>Public ID (URL segment)</label>
          <input
            className={input}
            value={publicId}
            onChange={(e) => setPublicId(e.target.value)}
            required
            placeholder="e.g. hooks-overview"
          />
        </div>
      )}
      <div>
        <label className={label}>Category</label>
        <select
          className={input}
          value={categorySlug}
          onChange={(e) => setCategorySlug(e.target.value)}
          required
        >
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.label} ({c.slug})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className={label}>Question</label>
        <textarea className={input} rows={2} value={question} onChange={(e) => setQuestion(e.target.value)} required />
      </div>
      <div>
        <label className={label}>Answer (main)</label>
        <textarea className={input} rows={6} value={answer} onChange={(e) => setAnswer(e.target.value)} required />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>Difficulty</label>
          <input
            className={input}
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            placeholder="Easy / Mid / Hard"
          />
        </div>
        <div>
          <label className={label}>Category badge</label>
          <input className={input} value={categoryBadge} onChange={(e) => setCategoryBadge(e.target.value)} />
        </div>
      </div>
      <div>
        <label className={label}>Answer intro (optional)</label>
        <textarea className={input} rows={3} value={answerIntro} onChange={(e) => setAnswerIntro(e.target.value)} />
      </div>
      <div>
        <label className={label}>Bullets JSON (optional)</label>
        <textarea
          className={`${input} font-mono text-xs`}
          rows={4}
          value={bulletsJson}
          onChange={(e) => setBulletsJson(e.target.value)}
          placeholder='[{"title":"…","text":"…"}]'
        />
      </div>
      <div>
        <label className={label}>Code example (optional)</label>
        <textarea
          className={`${input} font-mono text-xs`}
          rows={6}
          value={codeExample}
          onChange={(e) => setCodeExample(e.target.value)}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>Source name</label>
          <input className={input} value={sourceName} onChange={(e) => setSourceName(e.target.value)} />
        </div>
        <div>
          <label className={label}>Source URL</label>
          <input className={input} value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} />
        </div>
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

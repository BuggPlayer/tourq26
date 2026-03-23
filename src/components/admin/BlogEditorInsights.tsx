"use client";

import { useMemo } from "react";

type Props = {
  title: string;
  description: string;
  bodyHtml: string;
};

function stripHtml(html: string): string {
  if (typeof document === "undefined") {
    return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  }
  const d = document.createElement("div");
  d.innerHTML = html;
  return (d.textContent || d.innerText || "").replace(/\s+/g, " ").trim();
}

function countMatches(html: string, re: RegExp): number {
  const m = html.match(re);
  return m ? m.length : 0;
}

export function BlogEditorInsights({ title, description, bodyHtml }: Props) {
  const metrics = useMemo(() => {
    const plain = stripHtml(bodyHtml);
    const words = plain ? plain.split(/\s+/).filter(Boolean).length : 0;
    const sentences = plain
      ? plain.split(/[.!?]+/).filter((s) => s.trim().length > 0).length
      : 0;
    const avgWordsPerSentence =
      sentences > 0 ? Math.round((words / sentences) * 10) / 10 : 0;
    const readMin = Math.max(1, Math.round(words / 200));
    const h1 = countMatches(bodyHtml, /<h1\b/gi);
    const h2 = countMatches(bodyHtml, /<h2\b/gi);
    const h3 = countMatches(bodyHtml, /<h3\b/gi);
    const links = countMatches(bodyHtml, /<a\s/gi);
    const titleLen = title.trim().length;
    const descLen = description.trim().length;

    let score = 50;
    if (titleLen >= 30 && titleLen <= 65) score += 12;
    else if (titleLen >= 20 && titleLen < 75) score += 6;
    if (descLen >= 120 && descLen <= 170) score += 12;
    else if (descLen >= 80 && descLen < 200) score += 5;
    if (words >= 300) score += 10;
    else if (words >= 150) score += 5;
    if (h1 + h2 + h3 >= 2) score += 8;
    if (links >= 1 && links <= 12) score += 5;
    if (avgWordsPerSentence > 0 && avgWordsPerSentence <= 22) score += 5;
    else if (avgWordsPerSentence <= 28) score += 2;
    score = Math.min(100, Math.max(0, score));

    return {
      words,
      readMin,
      h1,
      h2,
      h3,
      links,
      titleLen,
      descLen,
      avgWordsPerSentence,
      score,
    };
  }, [title, description, bodyHtml]);

  const barColor =
    metrics.score >= 75 ? "bg-emerald-500" : metrics.score >= 55 ? "bg-amber-500" : "bg-rose-500";

  return (
    <div className="space-y-4 rounded-xl border border-slate-600 bg-slate-900/40 p-4">
      <div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium text-slate-300">Content score</span>
          <span className="text-lg font-bold text-white tabular-nums">{metrics.score}</span>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          Heuristic only (readability, structure, meta lengths). Not a guarantee of rankings.
        </p>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
          <div
            className={`h-full transition-all ${barColor}`}
            style={{ width: `${metrics.score}%` }}
          />
        </div>
      </div>
      <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-slate-500">Words</dt>
          <dd className="font-medium text-white tabular-nums">{metrics.words}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Est. read time</dt>
          <dd className="font-medium text-white">{metrics.readMin} min</dd>
        </div>
        <div>
          <dt className="text-slate-500">Headings (H1/H2/H3)</dt>
          <dd className="font-medium text-white tabular-nums">
            {metrics.h1}/{metrics.h2}/{metrics.h3}
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">Links in body</dt>
          <dd className="font-medium text-white tabular-nums">{metrics.links}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Title length</dt>
          <dd
            className={`font-medium tabular-nums ${
              metrics.titleLen >= 30 && metrics.titleLen <= 65 ? "text-emerald-400" : "text-slate-200"
            }`}
          >
            {metrics.titleLen}{" "}
            <span className="text-xs font-normal text-slate-500">(guide ~30–60)</span>
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">Meta description</dt>
          <dd
            className={`font-medium tabular-nums ${
              metrics.descLen >= 120 && metrics.descLen <= 170 ? "text-emerald-400" : "text-slate-200"
            }`}
          >
            {metrics.descLen}{" "}
            <span className="text-xs font-normal text-slate-500">(guide ~120–160)</span>
          </dd>
        </div>
        <div className="col-span-2 sm:col-span-3">
          <dt className="text-slate-500">Avg words / sentence</dt>
          <dd className="font-medium text-white tabular-nums">{metrics.avgWordsPerSentence || "—"}</dd>
        </div>
      </dl>
    </div>
  );
}

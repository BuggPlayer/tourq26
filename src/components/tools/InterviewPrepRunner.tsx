"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { InterviewCandidateOutput, InterviewHiringOutput } from "@/lib/tools/interview-output";
import { INTERVIEW_TRACK_IDS, type InterviewTrackId } from "@/lib/tools/schemas";
import { fieldClass, labelClass } from "./form-ui";

const LS_RATINGS = "torq-interview-ratings";

const TRACK_LABELS: Record<InterviewTrackId, string> = {
  frontend: "Frontend",
  backend: "Backend",
  system_design: "System design",
  devops: "DevOps / platform",
  mobile: "Mobile",
  data_ml: "Data / ML",
  security: "Security",
};

function cardId(session: string, track: string, question: string): string {
  let h = 0;
  const s = `${session}|${track}|${question}`;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return `${session.slice(0, 8)}_${(h >>> 0).toString(16)}`;
}

function loadAllRatings(): Record<string, { rating: number; updatedAt: string }> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(LS_RATINGS);
    if (!raw) return {};
    const p = JSON.parse(raw) as unknown;
    if (!p || typeof p !== "object") return {};
    return p as Record<string, { rating: number; updatedAt: string }>;
  } catch {
    return {};
  }
}

function saveRating(id: string, rating: number) {
  const all = loadAllRatings();
  all[id] = { rating, updatedAt: new Date().toISOString() };
  localStorage.setItem(LS_RATINGS, JSON.stringify(all));
}

function clearIds(ids: string[]) {
  const all = loadAllRatings();
  for (const id of ids) delete all[id];
  localStorage.setItem(LS_RATINGS, JSON.stringify(all));
}

export default function InterviewPrepRunner() {
  const sessionIdRef = useRef<string>(
    typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `s${Date.now()}`
  );
  const resultCardIdsRef = useRef<string[]>([]);

  const [mode, setMode] = useState<"candidate" | "hiring">("candidate");
  const [roleTitle, setRoleTitle] = useState("");
  const [level, setLevel] = useState<"junior" | "mid" | "senior" | "lead" | "staff">("senior");
  const [tracks, setTracks] = useState<InterviewTrackId[]>(["frontend", "backend"]);
  const [industryBar, setIndustryBar] = useState<
    "general" | "startup" | "big_tech" | "enterprise"
  >("general");
  const [frameworkFocus, setFrameworkFocus] = useState("");
  const [context, setContext] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [candidateData, setCandidateData] = useState<InterviewCandidateOutput | null>(null);
  const [hiringData, setHiringData] = useState<InterviewHiringOutput | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [ratings, setRatings] = useState<Record<string, number>>({});

  useEffect(() => {
    const all = loadAllRatings();
    const next: Record<string, number> = {};
    for (const [k, v] of Object.entries(all)) {
      if (typeof v?.rating === "number") next[k] = v.rating;
    }
    setRatings(next);
  }, []);

  const toggleTrack = (t: InterviewTrackId) => {
    setTracks((prev) => {
      if (prev.includes(t)) {
        if (prev.length <= 1) return prev;
        return prev.filter((x) => x !== t);
      }
      if (prev.length >= 4) return prev;
      return [...prev, t];
    });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setToast(null);
    setCandidateData(null);
    setHiringData(null);
    setLoading(true);
    resultCardIdsRef.current = [];
    try {
      const res = await fetch("/api/tools/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolId: "interview-prep",
          fields: {
            mode,
            roleTitle,
            level,
            tracks,
            industryBar,
            frameworkFocus,
            context,
          },
        }),
      });
      const json = (await res.json()) as unknown;

      if (!res.ok) {
        const msg =
          json &&
          typeof json === "object" &&
          json !== null &&
          "error" in json &&
          typeof (json as { error: unknown }).error === "string"
            ? (json as { error: string }).error
            : "Request failed";
        setError(msg);
        return;
      }

      if (
        json &&
        typeof json === "object" &&
        json !== null &&
        "format" in json &&
        (json as { format: string }).format === "structured"
      ) {
        const o = json as
          | { format: "structured"; mode: "candidate"; data: InterviewCandidateOutput }
          | { format: "structured"; mode: "hiring"; data: InterviewHiringOutput };
        if (o.mode === "candidate") {
          setCandidateData(o.data);
          const ids: string[] = [];
          for (const sec of o.data.sections) {
            for (const it of sec.items) {
              ids.push(cardId(sessionIdRef.current, sec.track, it.question));
            }
          }
          resultCardIdsRef.current = ids;
        } else {
          setHiringData(o.data);
          const ids: string[] = [];
          for (const sec of o.data.sections) {
            for (const it of sec.items) {
              ids.push(cardId(sessionIdRef.current, sec.track, it.question));
            }
          }
          resultCardIdsRef.current = ids;
        }
        return;
      }
      setError("Unexpected response. Try again.");
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  }, []);

  const copyText = useCallback(
    async (text: string, msg = "Copied") => {
      try {
        await navigator.clipboard.writeText(text);
        showToast(msg);
      } catch {
        setError("Could not copy");
      }
    },
    [showToast]
  );

  const shareText = useCallback(
    async (text: string) => {
      if (typeof navigator !== "undefined" && navigator.share) {
        try {
          await navigator.share({ text });
          showToast("Shared");
          return;
        } catch {
          /* fall through */
        }
      }
      await copyText(text, "Copied (share unavailable)");
    },
    [copyText, showToast]
  );

  const setRating = useCallback((id: string, rating: number) => {
    saveRating(id, rating);
    setRatings((prev) => ({ ...prev, [id]: rating }));
  }, []);

  const clearMyRatings = useCallback(() => {
    const ids = resultCardIdsRef.current;
    if (ids.length === 0) {
      showToast("Nothing to clear yet");
      return;
    }
    clearIds(ids);
    setRatings((prev) => {
      const next = { ...prev };
      for (const id of ids) delete next[id];
      return next;
    });
    showToast("Cleared ratings for this result");
  }, [showToast]);

  const trackOrder = useMemo(() => tracks, [tracks]);

  return (
    <div className="space-y-8">
      <form
        className="space-y-5 rounded-2xl border border-[var(--color-border)]/50 bg-[var(--surface)] p-6 sm:p-8"
        onSubmit={submit}
      >
        <div>
          <span className={labelClass}>Mode</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {(
              [
                ["candidate", "I'm interviewing (candidate)"],
                ["hiring", "I'm hiring (interviewer)"],
              ] as const
            ).map(([value, lab]) => (
              <button
                key={value}
                type="button"
                onClick={() => setMode(value)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  mode === value
                    ? "bg-[var(--color-primary)] text-[var(--background)]"
                    : "border border-[var(--color-border)] text-[var(--color-muted)] hover:text-white"
                }`}
              >
                {lab}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="ip-role">
            Role title
          </label>
          <input
            id="ip-role"
            className={fieldClass}
            placeholder="e.g. Senior Full-Stack Engineer"
            value={roleTitle}
            onChange={(e) => setRoleTitle(e.target.value)}
            required
            maxLength={200}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="ip-level">
            Level
          </label>
          <select
            id="ip-level"
            className={fieldClass}
            value={level}
            onChange={(e) => setLevel(e.target.value as typeof level)}
          >
            <option value="junior">Junior</option>
            <option value="mid">Mid</option>
            <option value="senior">Senior</option>
            <option value="lead">Lead</option>
            <option value="staff">Staff+</option>
          </select>
        </div>

        <div>
          <span className={labelClass}>
            Tracks (1–4) — frontend, backend, system design, DevOps, …
          </span>
          <div className="mt-2 flex flex-wrap gap-2">
            {INTERVIEW_TRACK_IDS.map((t) => {
              const on = tracks.includes(t);
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleTrack(t)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
                    on
                      ? "bg-[var(--color-primary)]/90 text-[var(--background)]"
                      : "border border-[var(--color-border)] text-[var(--color-muted)] hover:text-white"
                  }`}
                >
                  {TRACK_LABELS[t]}
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-[var(--color-muted)]">
            Tip: pick Frontend + type “React” below for React-focused questions.
          </p>
        </div>

        <div>
          <label className={labelClass} htmlFor="ip-industry">
            Industry bar
          </label>
          <select
            id="ip-industry"
            className={fieldClass}
            value={industryBar}
            onChange={(e) => setIndustryBar(e.target.value as typeof industryBar)}
          >
            <option value="general">General</option>
            <option value="startup">Startup</option>
            <option value="big_tech">Big tech</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="ip-fw">
            Framework / stack focus (optional)
          </label>
          <input
            id="ip-fw"
            className={fieldClass}
            placeholder="e.g. React, Node, Kubernetes"
            value={frameworkFocus}
            onChange={(e) => setFrameworkFocus(e.target.value)}
            maxLength={100}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="ip-ctx">
            Extra context (optional)
          </label>
          <textarea
            id="ip-ctx"
            className={`${fieldClass} min-h-[80px] resize-y`}
            placeholder={
              mode === "candidate"
                ? "Target companies, interview stage…"
                : "Company stage, team size…"
            }
            value={context}
            onChange={(e) => setContext(e.target.value)}
            maxLength={1200}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={loading || tracks.length === 0}
            className="rounded-full bg-[var(--color-primary)] px-6 py-3.5 text-sm font-semibold text-[var(--background)] transition-opacity hover:opacity-95 disabled:opacity-50"
          >
            {loading ? "Generating…" : mode === "candidate" ? "Generate Q&A" : "Generate interview pack"}
          </button>
          {(candidateData || hiringData) && (
            <button
              type="button"
              onClick={clearMyRatings}
              className="text-sm text-[var(--color-muted)] underline hover:text-white"
            >
              Clear my ratings (this result)
            </button>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-400" role="alert">
            {error}
          </p>
        )}
      </form>

      {toast && (
        <p className="text-center text-sm text-[var(--color-primary)]" role="status">
          {toast}
        </p>
      )}

      {loading && (
        <p className="text-sm text-[var(--color-muted)]">Structuring questions and answers…</p>
      )}

      {candidateData && (
        <CandidateResults
          data={candidateData}
          trackOrder={trackOrder}
          sessionId={sessionIdRef.current}
          ratings={ratings}
          setRating={setRating}
          copyText={copyText}
          shareText={shareText}
        />
      )}

      {hiringData && (
        <HiringResults
          data={hiringData}
          trackOrder={trackOrder}
          copyText={copyText}
          shareText={shareText}
        />
      )}

      <p className="text-xs text-[var(--color-muted)]">
        Self-ratings are stored only in your browser (localStorage). They are not sent to our servers.
      </p>
    </div>
  );
}

function CandidateResults({
  data,
  trackOrder,
  sessionId,
  ratings,
  setRating,
  copyText,
  shareText,
}: {
  data: InterviewCandidateOutput;
  trackOrder: InterviewTrackId[];
  sessionId: string;
  ratings: Record<string, number>;
  setRating: (id: string, r: number) => void;
  copyText: (t: string, m?: string) => void;
  shareText: (t: string) => void;
}) {
  const sectionByTrack = new Map(data.sections.map((s) => [s.track, s]));
  const orderedSections = trackOrder
    .map((t) => sectionByTrack.get(t))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <div className="space-y-10">
      <div className="rounded-2xl border border-[var(--color-border)]/50 bg-[var(--surface)] p-6 sm:p-8">
        <h2 className="font-display text-lg font-semibold text-white">Overview</h2>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-[var(--color-muted)]">
          {data.intro}
        </p>
        {data.studyPlan && data.studyPlan.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-white">Study plan</h3>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-[var(--color-muted)]">
              {data.studyPlan.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>
        )}
      </div>

      {orderedSections.map((sec) => (
        <section key={sec.track} className="space-y-4">
          <h2 className="font-display text-xl font-semibold text-[var(--color-primary)]">
            {TRACK_LABELS[sec.track as InterviewTrackId] ?? sec.track}
          </h2>
          <ul className="space-y-4">
            {sec.items.map((item, idx) => (
              <CandidateCard
                key={`${sec.track}-${idx}`}
                track={sec.track}
                item={item}
                sessionId={sessionId}
                ratings={ratings}
                setRating={setRating}
                copyText={copyText}
                shareText={shareText}
              />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function CandidateCard({
  track,
  item,
  sessionId,
  ratings,
  setRating,
  copyText,
  shareText,
}: {
  track: string;
  item: InterviewCandidateOutput["sections"][number]["items"][number];
  sessionId: string;
  ratings: Record<string, number>;
  setRating: (id: string, r: number) => void;
  copyText: (t: string, m?: string) => void;
  shareText: (t: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const id = cardId(sessionId, track, item.question);
  const qaBlock = `Q: ${item.question}\n\nA: ${item.answer}`;
  const diffStyles = {
    easy: "bg-emerald-500/15 text-emerald-300",
    medium: "bg-amber-500/15 text-amber-200",
    hard: "bg-rose-500/15 text-rose-200",
  } as const;

  return (
    <li className="rounded-2xl border border-[var(--color-border)]/50 bg-[var(--background)]/50 p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="flex-1 font-medium text-white">{item.question}</p>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${diffStyles[item.difficulty]}`}
        >
          {item.difficulty}
        </span>
      </div>
      {item.tags && item.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-white/5 px-2 py-0.5 text-xs text-[var(--color-muted)]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="mt-3 text-sm font-medium text-[var(--color-primary)] hover:underline"
      >
        {open ? "Hide answer" : "Show answer"}
      </button>
      {open && (
        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-[var(--color-muted)]">
          {item.answer}
        </p>
      )}
      <div className="mt-4 flex flex-wrap gap-2 border-t border-[var(--color-border)]/40 pt-4">
        <button
          type="button"
          onClick={() => copyText(item.question, "Question copied")}
          className="rounded-full border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium text-white hover:border-[var(--color-primary)]/40"
        >
          Copy question
        </button>
        <button
          type="button"
          onClick={() => copyText(qaBlock, "Q&A copied")}
          className="rounded-full border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium text-white hover:border-[var(--color-primary)]/40"
        >
          Copy Q+A
        </button>
        <button
          type="button"
          onClick={() => shareText(qaBlock)}
          className="rounded-full border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium text-white hover:border-[var(--color-primary)]/40"
        >
          Share
        </button>
      </div>
      <div className="mt-3 flex items-center gap-1">
        <span className="text-xs text-[var(--color-muted)]">How well I knew this:</span>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            aria-label={`Rate ${star} of 5`}
            onClick={() => setRating(id, star)}
            className={`text-lg leading-none ${(ratings[id] ?? 0) >= star ? "text-[var(--color-primary)]" : "text-[var(--color-muted)]/40"}`}
          >
            ★
          </button>
        ))}
      </div>
    </li>
  );
}

function HiringResults({
  data,
  trackOrder,
  copyText,
  shareText,
}: {
  data: InterviewHiringOutput;
  trackOrder: InterviewTrackId[];
  copyText: (t: string, m?: string) => void;
  shareText: (t: string) => void;
}) {
  const sectionByTrack = new Map(data.sections.map((s) => [s.track, s]));
  const orderedSections = trackOrder
    .map((t) => sectionByTrack.get(t))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <div className="space-y-10">
      <div className="rounded-2xl border border-[var(--color-border)]/50 bg-[var(--surface)] p-6 sm:p-8">
        <h2 className="font-display text-lg font-semibold text-white">Scorecard</h2>
        <ul className="mt-4 space-y-3">
          {data.scorecard.map((row, i) => (
            <li key={i} className="border-b border-[var(--color-border)]/30 pb-3 last:border-0">
              <p className="font-medium text-white">{row.competency}</p>
              <p className="mt-1 text-sm text-[var(--color-muted)]">{row.goodLooksLike}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-[var(--color-border)]/50 bg-[var(--surface)] p-6 sm:p-8">
        <h2 className="font-display text-lg font-semibold text-white">Interview rounds</h2>
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm text-[var(--color-muted)]">
          {data.rounds.map((r, i) => (
            <li key={i}>
              <span className="font-medium text-white">{r.name}</span> — {r.focus}{" "}
              <span className="text-[var(--color-muted)]">({r.durationHint})</span>
            </li>
          ))}
        </ol>
      </div>

      {data.redFlags && data.redFlags.length > 0 && (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6">
          <h2 className="font-display text-lg font-semibold text-rose-200">Red flags</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[var(--color-muted)]">
            {data.redFlags.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </div>
      )}

      {data.inclusiveTips && data.inclusiveTips.length > 0 && (
        <div className="rounded-2xl border border-[var(--color-border)]/50 bg-[var(--surface)] p-6 sm:p-8">
          <h2 className="font-display text-lg font-semibold text-white">Inclusive interviewing</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[var(--color-muted)]">
            {data.inclusiveTips.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </div>
      )}

      {orderedSections.map((sec) => (
        <section key={sec.track} className="space-y-4">
          <h2 className="font-display text-xl font-semibold text-[var(--color-primary)]">
            {TRACK_LABELS[sec.track as InterviewTrackId] ?? sec.track} — question bank
          </h2>
          <ul className="space-y-4">
            {sec.items.map((item, idx) => {
              const block = `Q: ${item.question}\n\nRubric: ${item.rubricHints}`;
              return (
                <li
                  key={`${sec.track}-${idx}`}
                  className="rounded-2xl border border-[var(--color-border)]/50 bg-[var(--background)]/50 p-4 sm:p-5"
                >
                  <p className="font-medium text-white">{item.question}</p>
                  <p className="mt-2 text-sm capitalize text-[var(--color-muted)]">
                    Difficulty: {item.difficulty}
                  </p>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-[var(--color-muted)]">
                    {item.rubricHints}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => copyText(item.question, "Copied")}
                      className="rounded-full border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium text-white hover:border-[var(--color-primary)]/40"
                    >
                      Copy question
                    </button>
                    <button
                      type="button"
                      onClick={() => copyText(block, "Copied")}
                      className="rounded-full border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium text-white hover:border-[var(--color-primary)]/40"
                    >
                      Copy Q+rubric
                    </button>
                    <button
                      type="button"
                      onClick={() => shareText(block)}
                      className="rounded-full border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium text-white hover:border-[var(--color-primary)]/40"
                    >
                      Share
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}

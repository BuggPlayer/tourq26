"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  JavaScriptInterviewTheory,
  ReactInterviewTheory,
} from "@/data/hub-interview-theory";

type Q = {
  id: string;
  type: string;
  title: string;
  topic: string;
  framework: string | null;
};

function practiceHref(q: Q): string {
  if (q.type === "DSA") return `/hub/candidate/coding/${q.id}`;
  if (q.type === "UI") return `/hub/candidate/ui/${q.id}`;
  if (q.type === "QUIZ") return `/hub/candidate/quiz?q=${q.id}`;
  if (q.type === "FRONTEND_SYSTEM_DESIGN") {
    return `/hub/candidate/system-design/${q.id}`;
  }
  return `/hub/candidate`;
}

function TrackPanel(props: {
  title: string;
  description: string;
  questions: Q[];
  loading: boolean;
  error: string | null;
  theory: ReactNode;
  accent: "cyan" | "violet";
}) {
  const [selectedId, setSelectedId] = useState<string>("");
  const selected = useMemo(
    () => props.questions.find((q) => q.id === selectedId),
    [props.questions, selectedId],
  );

  useEffect(() => {
    if (props.questions.length === 0) {
      setSelectedId("");
      return;
    }
    setSelectedId((prev) =>
      prev && props.questions.some((q) => q.id === prev)
        ? prev
        : props.questions[0].id,
    );
  }, [props.questions]);

  const border =
    props.accent === "cyan"
      ? "border-cyan-900/40 ring-1 ring-cyan-900/20"
      : "border-violet-900/40 ring-1 ring-violet-900/20";

  return (
    <section
      className={`rounded-2xl border bg-slate-900/50 p-5 ${border}`}
      aria-labelledby={`track-${props.accent}-title`}
    >
      <h2
        id={`track-${props.accent}-title`}
        className="font-display text-lg font-semibold text-white"
      >
        {props.title}
      </h2>
      <p className="mt-1 text-xs text-slate-500">{props.description}</p>

      <div className="mt-4 space-y-3">
        <label
          htmlFor={`pick-${props.accent}`}
          className="block text-xs font-medium uppercase tracking-wide text-slate-400"
        >
          Top picks (dropdown)
        </label>
        <select
          id={`pick-${props.accent}`}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          disabled={props.loading || props.questions.length === 0}
          aria-describedby={`hint-${props.accent}`}
        >
          {props.loading ? (
            <option value="">Loading questions…</option>
          ) : null}
          {!props.loading && props.questions.length === 0 ? (
            <option value="">No questions in this track</option>
          ) : null}
          {!props.loading &&
            props.questions.map((q) => (
            <option key={q.id} value={q.id}>
              [{q.type}] {q.title}
              {q.topic ? ` · ${q.topic}` : ""}
            </option>
          ))}
        </select>
        <p id={`hint-${props.accent}`} className="text-xs text-slate-500">
          Choose a problem, read the theory below, then open the workspace to write
          code and use <strong className="text-slate-400">Run</strong> /{" "}
          <strong className="text-slate-400">Submit</strong> to self-test.
        </p>
        {props.error && (
          <p className="text-xs text-red-400" role="alert">
            {props.error}
          </p>
        )}
        {selected && (
          <div className="flex flex-wrap gap-2">
            <Link
              href={practiceHref(selected)}
              className={`inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold text-slate-950 ${
                props.accent === "cyan"
                  ? "bg-cyan-500 hover:bg-cyan-400"
                  : "bg-violet-400 text-slate-900 hover:bg-violet-300"
              } focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950`}
            >
              Open editor &amp; test yourself →
            </Link>
            <span className="self-center text-xs text-slate-500">
              {selected.type === "DSA" && "Monaco + Piston sandbox"}
              {selected.type === "UI" && "Live preview + checks"}
              {selected.type === "QUIZ" && "MCQ with instant feedback"}
            </span>
          </div>
        )}
      </div>

      <details className="mt-6 group rounded-xl border border-slate-800 bg-slate-950/60 open:border-slate-700">
        <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-slate-200 [&::-webkit-details-marker]:hidden">
          <span className="flex items-center justify-between gap-2">
            Interview theory (read before / between attempts)
            <span className="text-cyan-500/80 group-open:rotate-180 transition-transform">
              ▼
            </span>
          </span>
        </summary>
        <div className="border-t border-slate-800 px-4 py-4">{props.theory}</div>
      </details>
    </section>
  );
}

export function CandidateInterviewTracks() {
  const [jsQs, setJsQs] = useState<Q[]>([]);
  const [reactQs, setReactQs] = useState<Q[]>([]);
  const [loadingJs, setLoadingJs] = useState(true);
  const [loadingReact, setLoadingReact] = useState(true);
  const [errJs, setErrJs] = useState<string | null>(null);
  const [errReact, setErrReact] = useState<string | null>(null);

  const loadJs = useCallback(async () => {
    setLoadingJs(true);
    setErrJs(null);
    try {
      const [dsa, vanilla, quizRes] = await Promise.all([
        fetch("/api/questions?type=DSA").then((r) => r.json()),
        fetch("/api/questions?type=UI&framework=vanilla").then((r) => r.json()),
        fetch("/api/questions?type=QUIZ").then((r) => r.json()),
      ]);
      if (dsa.error || vanilla.error || quizRes.error) {
        setErrJs(dsa.error || vanilla.error || quizRes.error);
        setJsQs([]);
        return;
      }
      const dsaList: Q[] = dsa.questions ?? [];
      const vanList: Q[] = vanilla.questions ?? [];
      const jsQuiz: Q[] = (quizRes.questions ?? []).filter(
        (q: Q) => q.topic === "javascript",
      );
      const merged = [...dsaList, ...vanList, ...jsQuiz];
      setJsQs(merged);
    } catch {
      setErrJs("Could not load JavaScript track questions.");
      setJsQs([]);
    } finally {
      setLoadingJs(false);
    }
  }, []);

  const loadReact = useCallback(async () => {
    setLoadingReact(true);
    setErrReact(null);
    try {
      const [ui, quizRes] = await Promise.all([
        fetch("/api/questions?type=UI&framework=react").then((r) => r.json()),
        fetch("/api/questions?type=QUIZ").then((r) => r.json()),
      ]);
      if (ui.error || quizRes.error) {
        setErrReact(ui.error || quizRes.error);
        setReactQs([]);
        return;
      }
      const uiList: Q[] = ui.questions ?? [];
      const reactQuiz: Q[] = (quizRes.questions ?? []).filter(
        (q: Q) => q.topic === "react",
      );
      setReactQs([...uiList, ...reactQuiz]);
    } catch {
      setErrReact("Could not load React track questions.");
      setReactQs([]);
    } finally {
      setLoadingReact(false);
    }
  }, []);

  useEffect(() => {
    loadJs();
    loadReact();
  }, [loadJs, loadReact]);

  return (
    <section
      className="space-y-4"
      aria-label="JavaScript and React interview tracks"
    >
      <div>
        <h2 className="font-display text-xl font-bold text-white">
          Interview tracks
        </h2>
        <p className="mt-1 max-w-3xl text-sm text-slate-400">
          Curated <strong className="text-slate-300">JavaScript</strong> and{" "}
          <strong className="text-slate-300">React</strong> questions from the
          bank. Pick from the dropdown, study the theory, then jump into the editor
          to implement and test yourself.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <TrackPanel
          title="JavaScript track"
          description="DSA you can solve in JS in the editor, vanilla DOM UI tasks, plus JS trivia quizzes."
          questions={jsQs}
          loading={loadingJs}
          error={errJs}
          theory={<JavaScriptInterviewTheory />}
          accent="cyan"
        />
        <TrackPanel
          title="React track"
          description="React UI labs (CDN template) and React-focused quizzes."
          questions={reactQs}
          loading={loadingReact}
          error={errReact}
          theory={<ReactInterviewTheory />}
          accent="violet"
        />
      </div>
    </section>
  );
}

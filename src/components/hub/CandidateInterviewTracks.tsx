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

  const effectiveSelectedId = useMemo(() => {
    if (props.questions.length === 0) return "";
    if (selectedId && props.questions.some((q) => q.id === selectedId)) return selectedId;
    return props.questions[0]!.id;
  }, [props.questions, selectedId]);

  const selected = useMemo(
    () => props.questions.find((q) => q.id === effectiveSelectedId),
    [props.questions, effectiveSelectedId],
  );

  const border =
    props.accent === "cyan"
      ? "border-primary/40 ring-1 ring-primary/20"
      : "border-accent/35 ring-1 ring-accent/20";

  return (
    <section
      className={`rounded-2xl border bg-surface/50 p-5 ${border}`}
      aria-labelledby={`track-${props.accent}-title`}
    >
      <h2
        id={`track-${props.accent}-title`}
        className="font-display text-lg font-semibold text-foreground"
      >
        {props.title}
      </h2>
      <p className="mt-1 text-xs text-muted-foreground">{props.description}</p>

      <div className="mt-4 space-y-3">
        <label
          htmlFor={`pick-${props.accent}`}
          className="block text-xs font-medium uppercase tracking-wide text-muted-foreground"
        >
          Top picks (dropdown)
        </label>
        <select
          id={`pick-${props.accent}`}
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          value={effectiveSelectedId}
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
        <p id={`hint-${props.accent}`} className="text-xs text-muted-foreground">
          Choose a problem, read the theory below, then open the workspace to write
          code and use <strong className="text-muted-foreground">Run</strong> /{" "}
          <strong className="text-muted-foreground">Submit</strong> to self-test.
        </p>
        {props.error && (
          <p className="text-xs text-destructive" role="alert">
            {props.error}
          </p>
        )}
        {selected && (
          <div className="flex flex-wrap gap-2">
            <Link
              href={practiceHref(selected)}
              className={`inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                props.accent === "cyan"
                  ? "bg-primary text-primary-foreground hover:bg-primary-hover focus-visible:ring-primary"
                  : "bg-accent text-accent-foreground hover:opacity-90 focus-visible:ring-accent"
              }`}
            >
              Open editor &amp; test yourself →
            </Link>
            <span className="self-center text-xs text-muted-foreground">
              {selected.type === "DSA" && "Monaco + Piston sandbox"}
              {selected.type === "UI" && "Live preview + checks"}
              {selected.type === "QUIZ" && "MCQ with instant feedback"}
            </span>
          </div>
        )}
      </div>

      <details className="mt-6 group rounded-xl border border-border bg-background/60 open:border-border">
        <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-foreground [&::-webkit-details-marker]:hidden">
          <span className="flex items-center justify-between gap-2">
            Interview theory (read before / between attempts)
            <span className="text-primary/80 group-open:rotate-180 transition-transform">
              ▼
            </span>
          </span>
        </summary>
        <div className="border-t border-border px-4 py-4">{props.theory}</div>
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
        <h2 className="font-display text-xl font-bold text-foreground">
          Interview tracks
        </h2>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
          Curated <strong className="text-foreground/90">JavaScript</strong> and{" "}
          <strong className="text-foreground/90">React</strong> questions from the
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

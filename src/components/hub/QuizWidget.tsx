"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";

export function QuizWidget() {
  const [q, setQ] = useState<{
    id: string;
    title: string;
    description: string;
    options: string[];
  } | null>(null);
  const [picked, setPicked] = useState<number | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const load = useCallback(() => {
    setPicked(null);
    setResult(null);
    fetch("/api/quiz/random")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) toast.error(d.error);
        else setQ(d);
      })
      .catch(() => toast.error("Could not load quiz"));
  }, []);

  async function submit() {
    if (!q || picked === null) return;
    const res = await fetch("/api/quiz/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId: q.id, choiceIndex: picked }),
    });
    const data = await res.json();
    setResult(
      data.correct
        ? `Correct! ${data.explanation}`
        : `Not quite. ${data.explanation}`,
    );
    if (data.correct) toast.success("Nice!");
    else toast.message("Review the explanation");
  }

  return (
    <section
      className="rounded-xl border border-slate-800 bg-slate-900/40 p-4"
      aria-labelledby="quiz-widget-title"
    >
      <h2 id="quiz-widget-title" className="font-semibold text-slate-100">
        Quick quiz
      </h2>
      {!q ? (
        <button
          type="button"
          onClick={load}
          className="mt-3 rounded-lg bg-cyan-600 px-3 py-2 text-sm font-medium text-white"
        >
          Load random question
        </button>
      ) : (
        <div className="mt-3 space-y-3 text-sm">
          <p className="font-medium text-slate-200">{q.title}</p>
          <p className="text-slate-400">{q.description}</p>
          <div className="space-y-2" role="radiogroup" aria-label="Choices">
            {q.options.map((opt, i) => (
              <label
                key={opt}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 hover:bg-slate-800/80"
              >
                <input
                  type="radio"
                  name="quiz"
                  checked={picked === i}
                  onChange={() => setPicked(i)}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={submit}
              className="rounded-lg bg-violet-600 px-3 py-1.5 text-sm text-white"
            >
              Check answer
            </button>
            <button
              type="button"
              onClick={load}
              className="rounded-lg border border-slate-600 px-3 py-1.5 text-sm"
            >
              Next
            </button>
          </div>
          {result && (
            <p className="text-xs text-slate-300" role="status">
              {result}
            </p>
          )}
        </div>
      )}
    </section>
  );
}

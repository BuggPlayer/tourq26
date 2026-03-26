"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";

function QuizBody() {
  const sp = useSearchParams();
  const qid = sp.get("q");
  const [q, setQ] = useState<{
    id: string;
    title: string;
    description: string;
    options: string[];
  } | null>(null);
  const [picked, setPicked] = useState<number | null>(null);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    if (!qid) return;
    fetch(`/api/quiz/${qid}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) toast.error(d.error);
        else setQ(d);
      });
  }, [qid]);

  async function check() {
    if (!q || picked === null) return;
    const res = await fetch("/api/quiz/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId: q.id, choiceIndex: picked }),
    });
    const data = await res.json();
    setResult(data.explanation);
  }

  if (!qid) {
    return (
      <p className="text-muted-foreground">
        Open a quiz from the candidate hub question list.
      </p>
    );
  }

  if (!q) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-bold text-foreground">{q.title}</h1>
      <p className="text-foreground/90">{q.description}</p>
      <div className="space-y-2" role="radiogroup">
        {q.options.map((opt, i) => (
          <label
            key={opt}
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2"
          >
            <input
              type="radio"
              name="q"
              checked={picked === i}
              onChange={() => setPicked(i)}
            />
            {opt}
          </label>
        ))}
      </div>
      <button
        type="button"
        onClick={check}
        className="rounded-lg bg-primary px-4 py-2 text-sm text-foreground"
      >
        Check
      </button>
      {result && <p className="text-sm text-foreground/90">{result}</p>}
    </div>
  );
}

export default function QuizPage() {
  return (
    <div>
      <Link href="/hub/candidate" className="text-sm text-primary hover:underline">
        ← Back
      </Link>
      <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}>
        <QuizBody />
      </Suspense>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { MonacoCodeEditor } from "./MonacoCodeEditor";

const LANGS = ["javascript", "python", "java", "cpp", "go"] as const;

function starterFor(
  lang: string,
  starters: Record<string, string>,
): string {
  return (
    starters[lang] ??
    starters.javascript ??
    "// Write your solution\n"
  );
}

export function DsaWorkspace(props: {
  questionId: string;
  title: string;
  description: string;
  defaultLanguage: (typeof LANGS)[number];
  starterByLang: Record<string, string>;
}) {
  const [lang, setLang] = useState<string>(props.defaultLanguage);
  const [value, setValue] = useState(() =>
    starterFor(props.defaultLanguage, props.starterByLang),
  );
  async function runCode() {
    const res = await fetch("/api/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: value, language: lang }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error ?? "Run failed");
      return;
    }
    toast.message(`stdout: ${data.stdout || "(empty)"}`, {
      description: data.stderr || undefined,
    });
  }

  async function submit() {
    const res = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        questionId: props.questionId,
        code: value,
        language: lang,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error ?? "Submit failed");
      return;
    }
    toast.success(data.passed ? "Tests passed" : "Keep iterating", {
      description: data.feedback,
    });
  }

  return (
    <div className="space-y-4">
      <nav aria-label="Breadcrumb">
        <Link href="/hub/candidate" className="text-sm text-primary hover:underline">
          ← Candidate hub
        </Link>
      </nav>
      <header>
        <h1 className="font-display text-2xl font-bold text-foreground">{props.title}</h1>
        <div className="prose prose-invert mt-2 max-w-none text-sm text-foreground/90">
          <p className="whitespace-pre-wrap">{props.description}</p>
        </div>
      </header>
      <div className="flex flex-wrap items-center gap-3">
        <label htmlFor="lang" className="text-sm text-muted-foreground">
          Language
        </label>
        <select
          id="lang"
          value={lang}
          onChange={(e) => {
            const next = e.target.value;
            setLang(next);
            setValue(starterFor(next, props.starterByLang));
          }}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          aria-label="Programming language"
        >
          {LANGS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={runCode}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium"
        >
          Run
        </button>
        <button
          type="button"
          onClick={submit}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-foreground"
        >
          Submit
        </button>
      </div>
      <MonacoCodeEditor
        value={value}
        onChange={setValue}
        language={lang}
        height="480px"
        aria-label="Solution code"
      />
    </div>
  );
}

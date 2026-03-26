"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { UI_TEMPLATES } from "@/lib/hub/ui-templates";
import { MonacoCodeEditor } from "./MonacoCodeEditor";

export function UiWorkspace(props: {
  questionId: string;
  title: string;
  description: string;
  initialHtml: string;
  framework: string;
}) {
  const [html, setHtml] = useState(props.initialHtml);
  const [fw, setFw] = useState(props.framework);

  function applyTemplate() {
    const t = UI_TEMPLATES[fw] ?? UI_TEMPLATES.vanilla;
    setHtml(t);
    toast.message(`Loaded ${fw} template`);
  }

  async function submit() {
    const res = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        questionId: props.questionId,
        code: html,
        language: "javascript",
        uiHtml: html,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error ?? "Submit failed");
      return;
    }
    toast.success(data.passed ? "UI checks passed" : "Try again", {
      description: data.feedback,
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <Link href="/hub/candidate" className="text-sm text-primary hover:underline">
          ← Back
        </Link>
        <h1 className="font-display text-2xl font-bold text-foreground">{props.title}</h1>
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{props.description}</p>
        <div className="flex flex-wrap gap-2">
          <label className="text-sm text-muted-foreground">
            Framework template
            <select
              className="ml-2 rounded-lg border border-border bg-background px-2 py-1"
              value={fw}
              onChange={(e) => setFw(e.target.value)}
              aria-label="Framework template"
            >
              {Object.keys(UI_TEMPLATES).map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={applyTemplate}
            className="rounded-lg border border-border px-3 py-1 text-sm"
          >
            Reset to template
          </button>
          <button
            type="button"
            onClick={submit}
            className="rounded-lg bg-primary px-4 py-1 text-sm font-semibold text-foreground"
          >
            Submit
          </button>
        </div>
        <MonacoCodeEditor
          value={html}
          onChange={setHtml}
          language="html"
          height="420px"
          aria-label="UI source code"
        />
      </div>
      <div>
        <h2 className="mb-2 text-sm font-medium text-muted-foreground">Live preview</h2>
        <iframe
          title="UI preview"
          sandbox="allow-scripts allow-same-origin"
          className="h-[480px] w-full rounded-xl border border-border bg-white"
          srcDoc={html}
        />
      </div>
    </div>
  );
}

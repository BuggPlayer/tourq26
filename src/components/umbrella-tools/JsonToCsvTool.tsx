"use client";

import { useMemo, useState } from "react";
import FileUploader from "@/components/umbrella-tools/FileUploader";
import CodeBlock from "@/components/umbrella-tools/CodeBlock";
import { DevToolPageShell } from "@/components/umbrella-tools/DevToolPageShell";
import { jsonToCSV, validateJSON } from "@/lib/umbrella-tools/json";

const TOOL_SLUG = "json-to-csv";

export default function JsonToCsvTool() {
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const csv = useMemo(() => {
    if (!input.trim()) return "";
    const v = validateJSON(input);
    if (!v.valid) return "";
    try {
      const data = JSON.parse(input) as unknown;
      if (!Array.isArray(data)) {
        return "";
      }
      if (data.length === 0) return "";
      return jsonToCSV(data as Record<string, unknown>[]);
    } catch {
      return "";
    }
  }, [input]);

  function applyInput(next: string) {
    setInput(next);
    const trimmed = next.trim();
    if (!trimmed) {
      setError(null);
      return;
    }
    const v = validateJSON(trimmed);
    if (!v.valid) {
      setError(v.error);
      return;
    }
    try {
      const data = JSON.parse(trimmed) as unknown;
      if (!Array.isArray(data)) {
        setError("JSON must be an array of objects, e.g. [{ \"a\": 1 }, { \"a\": 2 }].");
        return;
      }
      if (data.length > 0 && (typeof data[0] !== "object" || data[0] === null || Array.isArray(data[0]))) {
        setError("Each array item must be a plain object.");
        return;
      }
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON.");
    }
  }

  function downloadCsv() {
    if (!csv) return;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "export.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <DevToolPageShell slug={TOOL_SLUG}>
      
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-muted-foreground">JSON input</label>
          <textarea
            value={input}
            onChange={(e) => applyInput(e.target.value)}
            rows={16}
            placeholder='[ { "name": "Ada", "role": "Dev" }, { "name": "Bob", "role": "PM" } ]'
            className="w-full resize-y rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <FileUploader accept=".json,application/json" onFileLoad={applyInput} />
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-medium text-muted-foreground">CSV output</h2>
            <button
              type="button"
              disabled={!csv}
              onClick={downloadCsv}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-40 hover:opacity-90"
            >
              Download .csv
            </button>
          </div>
          {csv ? <CodeBlock code={csv} language="csv" /> : <p className="text-sm text-muted-foreground">Valid JSON array will render here.</p>}
        </div>
      </div>
    </DevToolPageShell>
  );
}

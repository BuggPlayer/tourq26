"use client";

import { useMemo, useState } from "react";
import ToolHeader from "@/components/umbrella-tools/ToolHeader";
import { parseDatabaseUrl } from "@/lib/umbrella-tools/database-url";
import { getDevToolBySlug } from "@/lib/umbrella-tools/tools-config";

const TOOL_SLUG = "database-url-parser";

export default function DatabaseUrlParserTool() {
  const [input, setInput] = useState("");
  const meta = getDevToolBySlug(TOOL_SLUG);

  const parsed = useMemo(() => {
    if (!input.trim()) return null;
    try {
      return parseDatabaseUrl(input);
    } catch {
      return null;
    }
  }, [input]);

  const error = input.trim() && !parsed ? "Could not parse this URL. Check the scheme and format." : null;

  return (
    <>
      <ToolHeader
        title="Database URL parser"
        description="Paste a database connection URL to see scheme, host, port, credentials, and database name. Parsed only in your browser."
        category={meta?.category}
      />
      <label className="block text-sm font-medium text-muted-foreground">Connection URL</label>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={4}
        placeholder="postgresql://user:pass@host:5432/mydb?sslmode=require"
        className="mt-2 w-full resize-y rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      />
      {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
      {parsed ? (
        <dl className="mt-8 grid gap-4 sm:grid-cols-2">
          {(
            [
              ["Scheme", parsed.scheme],
              ["Host", parsed.host],
              ["Port", parsed.port],
              ["Username", parsed.username],
              ["Password", parsed.password],
              ["Database", parsed.database],
            ] as const
          ).map(([k, v]) => (
            <div key={k} className="rounded-xl border border-border/60 bg-surface/80 px-4 py-3">
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{k}</dt>
              <dd className="mt-1 break-all font-mono text-sm text-foreground">{v}</dd>
            </div>
          ))}
          {Object.keys(parsed.searchParams).length > 0 ? (
            <div className="sm:col-span-2 rounded-xl border border-border/60 bg-surface/80 px-4 py-3">
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Query parameters</dt>
              <dd className="mt-2 space-y-1">
                {Object.entries(parsed.searchParams).map(([k, v]) => (
                  <div key={k} className="flex flex-wrap gap-2 font-mono text-sm">
                    <span className="text-primary">{k}</span>
                    <span className="text-muted-foreground">=</span>
                    <span className="break-all text-foreground">{v}</span>
                  </div>
                ))}
              </dd>
            </div>
          ) : null}
        </dl>
      ) : null}
    </>
  );
}

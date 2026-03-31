"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import type { editor } from "monaco-editor";
import {
  DEV_TOOL_PRIMARY_SURFACE_CLASS,
  DevToolPageShell,
} from "@/components/umbrella-tools/DevToolPageShell";
import {
  CODE_PLAYGROUND_STARTERS,
  PLAYGROUND_LANGUAGES,
  type PlaygroundLanguage,
} from "@/lib/umbrella-tools/code-playground-starters";

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const STORAGE_KEY = "torq-devtools-code-playground-v1";

const TOOL_SLUG = "code-playground";

type StoredShape = {
  language: PlaygroundLanguage;
  sources: Partial<Record<PlaygroundLanguage, string>>;
};

function loadStored(): StoredShape | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as StoredShape;
    if (!p.language || !CODE_PLAYGROUND_STARTERS[p.language]) return null;
    return p;
  } catch {
    return null;
  }
}

function saveStored(data: StoredShape) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* ignore quota */
  }
}

export default function CodePlaygroundTool() {
  const { resolvedTheme } = useTheme();
  const [language, setLanguage] = useState<PlaygroundLanguage>("javascript");
  const [sources, setSources] = useState<Partial<Record<PlaygroundLanguage, string>>>(() => {
    const init: Partial<Record<PlaygroundLanguage, string>> = {};
    for (const { id } of PLAYGROUND_LANGUAGES) {
      init[id] = CODE_PLAYGROUND_STARTERS[id];
    }
    return init;
  });
  const [hydrated, setHydrated] = useState(false);
  const [running, setRunning] = useState(false);
  const [stdout, setStdout] = useState("");
  const [stderr, setStderr] = useState("");
  const [exitCode, setExitCode] = useState<number | null>(null);
  const [runError, setRunError] = useState<string | null>(null);
  const [htmlPreviewKey, setHtmlPreviewKey] = useState(0);

  const code = sources[language] ?? CODE_PLAYGROUND_STARTERS[language];

  useEffect(() => {
    const s = loadStored();
    if (s) {
      setLanguage(s.language);
      setSources((prev) => {
        const next = { ...prev };
        for (const [k, v] of Object.entries(s.sources)) {
          const lang = k as PlaygroundLanguage;
          if (typeof v === "string" && v.trim()) next[lang] = v;
        }
        return next;
      });
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveStored({ language, sources });
  }, [language, sources, hydrated]);

  const monacoTheme = resolvedTheme === "dark" ? "vs-dark" : "light";
  const meta = PLAYGROUND_LANGUAGES.find((l) => l.id === language)!;

  const setCode = useCallback((next: string) => {
    setSources((prev) => ({ ...prev, [language]: next }));
  }, [language]);

  const runCode = useCallback(async () => {
    setRunError(null);
    setStdout("");
    setStderr("");
    setExitCode(null);

    if (meta.clientOnly) {
      setHtmlPreviewKey((k) => k + 1);
      return;
    }

    setRunning(true);
    try {
      const res = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language: language as "javascript" | "typescript" | "python" | "java" | "cpp" | "go",
          source: "playground" as const,
        }),
      });
      const data = (await res.json()) as {
        error?: string;
        stdout?: string;
        stderr?: string;
        code?: number | null;
        signal?: string | null;
      };
      if (!res.ok) {
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }
      setStdout(data.stdout ?? "");
      setStderr(data.stderr ?? "");
      setExitCode(data.code ?? null);
      if (data.signal) setStderr((e) => (e ? `${e}\n` : "") + `signal: ${data.signal}`);
    } catch (e) {
      setRunError(e instanceof Error ? e.message : "Run failed");
    } finally {
      setRunning(false);
    }
  }, [code, language, meta.clientOnly]);

  const onSelectLanguage = useCallback((next: PlaygroundLanguage) => {
    setLanguage(next);
    setRunError(null);
  }, []);

  const resetStarter = useCallback(() => {
    setSources((prev) => ({ ...prev, [language]: CODE_PLAYGROUND_STARTERS[language] }));
  }, [language]);

  const copyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      /* ignore */
    }
  }, [code]);

  const clearOutput = useCallback(() => {
    setStdout("");
    setStderr("");
    setExitCode(null);
    setRunError(null);
  }, []);

  const editorOptions = useMemo(
    (): editor.IStandaloneEditorConstructionOptions => ({
      minimap: { enabled: true },
      fontSize: 14,
      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      wordWrap: "on",
      renderWhitespace: "selection",
      bracketPairColorization: { enabled: true },
      smoothScrolling: true,
      padding: { top: 12, bottom: 12 },
      scrollBeyondLastColumn: 3,
      cursorBlinking: "smooth",
      formatOnPaste: false,
      quickSuggestions: true,
    }),
    [],
  );

  const onMount = useCallback(
    (ed: editor.IStandaloneCodeEditor, monaco: typeof import("monaco-editor")) => {
      ed.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
        void runCode();
      });
    },
    [runCode],
  );

  return (
    <DevToolPageShell slug={TOOL_SLUG} showTryHeading={false}>
      <div className={`min-w-0 space-y-4 ${DEV_TOOL_PRIMARY_SURFACE_CLASS}`}>
        <p className="text-muted-foreground">
          Monaco editor with run, console output, and HTML preview. JavaScript, TypeScript, Python, Java, C++, and Go run in a
          remote sandbox (Piston). Your code is sent to the executor service — do not paste secrets.
        </p>

        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border/60 bg-surface/40 p-3">
          <label htmlFor="pg-lang" className="text-sm font-medium text-foreground">
            Language
          </label>
          <select
            id="pg-lang"
            value={language}
            onChange={(e) => onSelectLanguage(e.target.value as PlaygroundLanguage)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
          >
            {PLAYGROUND_LANGUAGES.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => void runCode()}
            disabled={running}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-hover disabled:opacity-50"
          >
            {running ? "Running…" : meta.clientOnly ? "Refresh preview" : "Run"}
          </button>
          <button
            type="button"
            onClick={clearOutput}
            className="rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
          >
            Clear output
          </button>
          <button
            type="button"
            onClick={copyCode}
            className="rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
          >
            Copy code
          </button>
          <button
            type="button"
            onClick={resetStarter}
            className="rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
          >
            Reset starter
          </button>
          <span className="text-xs text-muted-foreground">
            <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono">⌘</kbd>
            <kbd className="ml-1 rounded border border-border bg-muted px-1.5 py-0.5 font-mono">Enter</kbd> to run
          </span>
        </div>

        <div className="grid min-h-[min(72vh,820px)] min-w-0 gap-4 lg:grid-cols-2 lg:gap-6">
          <div className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-border/70 bg-[#1e1e1e] shadow-inner dark:bg-[#0d1117]">
            <div className="border-b border-white/10 px-3 py-2 text-xs font-medium text-white/70">Editor</div>
            <div className="min-h-[min(50vh,480px)] flex-1 lg:min-h-0">
              <Editor
                height="100%"
                language={meta.monaco}
                theme={monacoTheme === "vs-dark" ? "vs-dark" : "light"}
                value={code}
                onChange={(v) => setCode(v ?? "")}
                onMount={onMount}
                options={editorOptions}
                className="min-h-[min(50vh,480px)] lg:min-h-[560px]"
              />
            </div>
          </div>

          <div className="flex min-h-0 flex-col gap-4">
            {meta.clientOnly ? (
              <div className="flex min-h-[min(50vh,480px)] flex-1 flex-col overflow-hidden rounded-xl border border-border/70 bg-surface/50">
                <div className="border-b border-border/60 px-3 py-2 text-xs font-medium text-muted-foreground">
                  Live preview (sandboxed iframe)
                </div>
                <iframe
                  key={htmlPreviewKey}
                  title="HTML preview"
                  sandbox="allow-scripts"
                  className="min-h-[min(46vh,440px)] w-full flex-1 rounded-b-xl bg-white"
                  srcDoc={code}
                />
              </div>
            ) : (
              <div className="flex min-h-[min(50vh,480px)] flex-1 flex-col overflow-hidden rounded-xl border border-border/70 bg-surface/50">
                <div className="border-b border-border/60 px-3 py-2 text-xs font-medium text-muted-foreground">Console</div>
                <div className="min-h-0 flex-1 overflow-auto p-3 font-mono text-xs leading-relaxed">
                  {runError ? (
                    <pre className="whitespace-pre-wrap text-destructive">{runError}</pre>
                  ) : (
                    <>
                      {stdout ? (
                        <pre className="whitespace-pre-wrap text-foreground">{stdout}</pre>
                      ) : !stderr ? (
                        <p className="text-muted-foreground">Output appears here after Run.</p>
                      ) : null}
                      {stderr ? (
                        <pre className="mt-2 whitespace-pre-wrap text-amber-700 dark:text-amber-400">{stderr}</pre>
                      ) : null}
                      {exitCode !== null && (
                        <p className="mt-3 text-muted-foreground">Exit code: {exitCode}</p>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ul className="mt-6 list-inside list-disc space-y-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
        <li>Editor: Monaco (VS Code engine) — minimap, bracket colorization, word wrap, Cmd/Ctrl+Enter to run.</li>
        <li>
          Execution uses the public Piston API (same stack as many online judges). Availability and language versions are
          defined by that service.
        </li>
        <li>TypeScript is transpiled to JavaScript on the server, then executed as JS.</li>
        <li>HTML mode runs only in your browser (sandboxed iframe, scripts allowed in isolation).</li>
      </ul>
    </DevToolPageShell>
  );
}

"use client";

import dynamic from "next/dynamic";
import { useCallback, useMemo, useState } from "react";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const SyntaxHighlighter = dynamic(
  () => import("react-syntax-highlighter").then((m) => m.Prism),
  {
    ssr: false,
    loading: () => (
      <pre className="rounded-lg bg-surface-elevated p-4 text-sm text-muted-foreground">
        Loading highlighter…
      </pre>
    ),
  },
);

const LANG_ALIASES: Record<string, string> = {
  csv: "markdown",
};

type Props = {
  code: string;
  language: string;
};

export default function CodeBlock({ code, language }: Props) {
  const [copied, setCopied] = useState(false);
  const prismLang = useMemo(() => LANG_ALIASES[language] ?? language, [language]);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [code]);

  return (
    <div className="relative overflow-hidden rounded-xl border border-border">
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Code copied to clipboard" : `Copy ${language} code to clipboard`}
        className="absolute right-3 top-3 z-10 rounded-lg bg-foreground/10 px-3 py-1.5 text-xs font-medium text-foreground backdrop-blur-sm transition-colors hover:bg-foreground/18"
      >
        {copied ? "Copied" : "Copy"}
      </button>
      <p role="status" aria-live="polite" className="sr-only">
        {copied ? "Code copied to clipboard." : ""}
      </p>
      <SyntaxHighlighter
        language={prismLang}
        style={oneDark}
        showLineNumbers={code.split("\n").length > 3}
        customStyle={{
          margin: 0,
          borderRadius: "0.75rem",
          fontSize: "0.8125rem",
          maxHeight: "24rem",
          background: "var(--app-surface-elevated)",
        }}
        codeTagProps={{ className: "font-mono" }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

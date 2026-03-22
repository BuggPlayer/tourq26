"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const LANG_MAP: Record<string, string> = {
  javascript: "javascript",
  python: "python",
  java: "java",
  cpp: "cpp",
  go: "go",
};

export function MonacoCodeEditor(props: {
  value: string;
  onChange: (v: string) => void;
  language: string;
  height?: string;
  "aria-label"?: string;
}) {
  const monacoLang = LANG_MAP[props.language] ?? "javascript";
  const options = useMemo(
    () => ({
      minimap: { enabled: false },
      fontSize: 14,
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
    }),
    [],
  );

  return (
    <Editor
      height={props.height ?? "420px"}
      language={monacoLang}
      value={props.value}
      onChange={(v) => props.onChange(v ?? "")}
      theme="vs-dark"
      options={options}
      aria-label={props["aria-label"] ?? "Code editor"}
    />
  );
}

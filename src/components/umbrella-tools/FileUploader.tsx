"use client";

import { useCallback, useRef, useState } from "react";

type Props = {
  accept: string;
  onFileLoad: (text: string) => void;
  label?: string;
};

function extMatches(name: string, accept: string): boolean {
  const parts = accept.split(",").map((p) => p.trim().toLowerCase());
  const lower = name.toLowerCase();
  for (const p of parts) {
    if (p.startsWith(".")) {
      if (lower.endsWith(p)) return true;
    } else if (p.includes("/")) {
      /* mime — best effort */
      if (p.endsWith("/*")) {
        const base = p.slice(0, -2);
        if (lower.endsWith(base.split("/")[0])) return true;
      }
    }
  }
  return parts.some((p) => p === "*" || p === "*/*");
}

export default function FileUploader({ accept, onFileLoad, label = "Drop a file or click to browse" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      setError(null);
      if (!extMatches(file.name, accept)) {
        setError(`Please choose a file matching: ${accept}`);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const text = typeof reader.result === "string" ? reader.result : "";
        onFileLoad(text);
      };
      reader.onerror = () => setError("Could not read the file.");
      reader.readAsText(file);
    },
    [accept, onFileLoad],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  return (
    <div className="space-y-2">
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`cursor-pointer rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
          dragOver
            ? "border-primary bg-primary-muted"
            : "border-border bg-surface hover:border-muted"
        }`}
      >
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 text-xs text-muted-foreground/80">Accepted: {accept}</p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
      </div>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
    </div>
  );
}

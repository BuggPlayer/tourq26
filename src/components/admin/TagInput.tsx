"use client";

import { useState, type KeyboardEvent } from "react";

export function TagInput({
  value,
  onChange,
  placeholder = "Add a tag…",
  max = 8,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  max?: number;
}) {
  const [draft, setDraft] = useState("");

  const commit = (raw?: string) => {
    const candidates = (raw ?? draft)
      .split(/[,\n]/)
      .map((t) => t.trim())
      .filter(Boolean);
    if (candidates.length === 0) return;
    const next = Array.from(new Set([...value, ...candidates])).slice(0, max);
    onChange(next);
    setDraft("");
  };

  const remove = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commit();
    } else if (e.key === "Backspace" && draft === "" && value.length > 0) {
      e.preventDefault();
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5 rounded-[var(--radius-sm)] border border-border bg-background px-2 py-1.5 focus-within:border-foreground">
      {value.map((t) => (
        <span
          key={t}
          className="mono-label inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-foreground"
        >
          {t.toUpperCase()}
          <button
            type="button"
            onClick={() => remove(t)}
            className="rounded-full text-muted-foreground transition-colors hover:text-foreground"
            aria-label={`Remove ${t}`}
          >
            ×
          </button>
        </span>
      ))}
      {value.length < max ? (
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKey}
          onBlur={() => commit()}
          placeholder={value.length === 0 ? placeholder : ""}
          className="min-w-[8ch] flex-1 bg-transparent px-1 py-1 text-[14px] outline-none placeholder:text-muted-foreground"
        />
      ) : null}
    </div>
  );
}

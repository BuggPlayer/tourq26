"use client";

import { useEffect, useRef } from "react";

export type QuillEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  /** Quill `modules` option (toolbar, clipboard, …). Captured once on mount — keep stable via `useMemo`. */
  modules: Record<string, unknown>;
  className?: string;
};

/**
 * Quill 1.x without react-quill — avoids React 19’s removed `findDOMNode` used by react-quill.
 */
export function QuillEditor({ value, onChange, placeholder, modules, className }: QuillEditorProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<InstanceType<typeof import("quill").default> | null>(null);
  const skipEmit = useRef(false);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const initialModulesRef = useRef(modules);
  const initialPlaceholderRef = useRef(placeholder);
  const initialValueRef = useRef(value);

  useEffect(() => {
    let cancelled = false;
    const mountEl = wrapRef.current;
    if (!mountEl) return;

    (async () => {
      const Quill = (await import("quill")).default;
      if (cancelled) return;

      const q = new Quill(mountEl, {
        theme: "snow",
        placeholder: initialPlaceholderRef.current ?? "",
        modules: initialModulesRef.current,
      } as never);
      quillRef.current = q;

      const start = initialValueRef.current;
      if (start) {
        q.clipboard.dangerouslyPasteHTML(start);
      }

      q.on("text-change", () => {
        if (skipEmit.current) return;
        const html = q.root.innerHTML;
        const out = html === "<p><br></p>" || html === "<p></p>" ? "" : html;
        onChangeRef.current(out);
      });
    })();

    return () => {
      cancelled = true;
      quillRef.current = null;
      mountEl.innerHTML = "";
    };
  }, []);

  useEffect(() => {
    const q = quillRef.current;
    if (!q) return;
    const cur = q.root.innerHTML;
    const norm = (s: string) => (s === "" || s === "<p><br></p>" || s === "<p></p>" ? "" : s);
    if (norm(value) === norm(cur)) return;
    skipEmit.current = true;
    q.clipboard.dangerouslyPasteHTML(value || "<p><br></p>");
    skipEmit.current = false;
  }, [value]);

  return <div ref={wrapRef} className={className} />;
}

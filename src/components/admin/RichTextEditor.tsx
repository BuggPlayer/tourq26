"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => (
    <div
      className="flex min-h-[14rem] items-center justify-center rounded-lg border border-slate-600 bg-slate-900/40 text-sm text-slate-500"
      aria-hidden
    >
      Loading editor…
    </div>
  ),
});

export type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
};

/** Industry-style toolbar: H1–H3, semantic blocks, lists, indent, link, clear formatting. */
const QUILL_FORMATS = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "indent",
  "blockquote",
  "code-block",
  "link",
  "align",
] as const;

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your content…",
  minHeight = "14rem",
}: RichTextEditorProps) {
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ indent: "-1" }, { indent: "+1" }],
          ["blockquote", "code-block"],
          ["link"],
          [{ align: [] }],
          ["clean"],
        ],
      },
      clipboard: { matchVisual: false },
    }),
    [],
  );

  return (
    <div
      className="admin-quill-editor overflow-hidden rounded-lg border border-slate-600 bg-slate-900/50"
      style={{ minHeight }}
    >
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={[...QUILL_FORMATS]}
        placeholder={placeholder}
        className="admin-quill-react"
      />
    </div>
  );
}

"use client";

import { useMemo } from "react";
import { QuillEditor } from "@/components/admin/QuillEditor";

export type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
};

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
      className="admin-quill-editor overflow-hidden rounded-lg border border-border bg-surface/50"
      style={{ minHeight }}
    >
      <QuillEditor
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        modules={modules}
        className="admin-quill-react"
      />
    </div>
  );
}

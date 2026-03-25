"use client";

import { useMemo, useState } from "react";
import FileUploader from "@/components/umbrella-tools/FileUploader";
import CodeBlock from "@/components/umbrella-tools/CodeBlock";
import PreviewBox from "@/components/umbrella-tools/PreviewBox";
import ToolHeader from "@/components/umbrella-tools/ToolHeader";
import { svgToDataURL, validateSVG } from "@/lib/umbrella-tools/svg";

export default function SvgToCssBackgroundTool() {
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const cssOut = useMemo(() => {
    if (!input.trim()) return "";
    const v = validateSVG(input);
    if (!v.valid) return "";
    const data = svgToDataURL(input);
    return `background-image: ${data};\nbackground-repeat: no-repeat;\nbackground-position: center;\nbackground-size: contain;`;
  }, [input]);

  function applyInput(next: string) {
    setInput(next);
    const v = validateSVG(next);
    setError(next.trim() ? (v.valid ? null : v.error) : null);
  }

  return (
    <>
      <ToolHeader
        title="SVG to CSS background"
        description="Paste SVG markup or upload an .svg file. We validate the SVG and output a data-URL background you can paste into CSS."
      />
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-[var(--color-muted)]">SVG source</label>
          <textarea
            value={input}
            onChange={(e) => applyInput(e.target.value)}
            rows={12}
            placeholder="<svg xmlns='http://www.w3.org/2000/svg' ...>...</svg>"
            className="w-full resize-y rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 font-mono text-sm text-[var(--foreground)] placeholder:text-[var(--color-muted)]/50 focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
          />
          <FileUploader accept=".svg,image/svg+xml" onFileLoad={applyInput} />
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
        </div>
        <div className="space-y-6">
          <div>
            <h2 className="mb-2 text-sm font-medium text-[var(--color-muted)]">Generated CSS</h2>
            {cssOut ? <CodeBlock code={cssOut} language="css" /> : <p className="text-sm text-[var(--color-muted)]">Valid SVG will appear here.</p>}
          </div>
          <div>
            <h2 className="mb-2 text-sm font-medium text-[var(--color-muted)]">Preview</h2>
            <PreviewBox className="flex min-h-[200px] items-center justify-center">
              {cssOut ? (
                <div
                  className="h-40 w-full max-w-sm rounded-lg border border-[var(--color-border)]/60 bg-[var(--color-surface)]"
                  style={{
                    backgroundImage: svgToDataURL(input),
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "contain",
                  }}
                />
              ) : (
                <span className="text-sm text-[var(--color-muted)]">Preview</span>
              )}
            </PreviewBox>
          </div>
        </div>
      </div>
    </>
  );
}

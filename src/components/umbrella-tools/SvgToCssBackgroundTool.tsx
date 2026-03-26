"use client";

import { useMemo, useState } from "react";
import FileUploader from "@/components/umbrella-tools/FileUploader";
import CodeBlock from "@/components/umbrella-tools/CodeBlock";
import PreviewBox from "@/components/umbrella-tools/PreviewBox";
import ToolHeader from "@/components/umbrella-tools/ToolHeader";
import { getDevToolBySlug } from "@/lib/umbrella-tools/tools-config";
import { svgToDataURL, validateSVG } from "@/lib/umbrella-tools/svg";

const TOOL_SLUG = "svg-to-css-background";

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

  const meta = getDevToolBySlug(TOOL_SLUG);

  return (
    <>
      <ToolHeader
        title="SVG to CSS background"
        description="Paste SVG markup or upload an .svg file. We validate the SVG and output a data-URL background you can paste into CSS."
        category={meta?.category}
      />
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-muted-foreground">SVG source</label>
          <textarea
            value={input}
            onChange={(e) => applyInput(e.target.value)}
            rows={12}
            placeholder="<svg xmlns='http://www.w3.org/2000/svg' ...>...</svg>"
            className="w-full resize-y rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <FileUploader accept=".svg,image/svg+xml" onFileLoad={applyInput} />
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>
        <div className="space-y-6">
          <div>
            <h2 className="mb-2 text-sm font-medium text-muted-foreground">Generated CSS</h2>
            {cssOut ? <CodeBlock code={cssOut} language="css" /> : <p className="text-sm text-muted-foreground">Valid SVG will appear here.</p>}
          </div>
          <div>
            <h2 className="mb-2 text-sm font-medium text-muted-foreground">Preview</h2>
            <PreviewBox className="flex min-h-[200px] items-center justify-center">
              {cssOut ? (
                <div
                  className="h-40 w-full max-w-sm rounded-lg border border-border/60 bg-surface"
                  style={{
                    backgroundImage: svgToDataURL(input),
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "contain",
                  }}
                />
              ) : (
                <span className="text-sm text-muted-foreground">Preview</span>
              )}
            </PreviewBox>
          </div>
        </div>
      </div>
    </>
  );
}

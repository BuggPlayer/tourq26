"use client";

import { useMemo, useState } from "react";
import CodeBlock from "@/components/umbrella-tools/CodeBlock";
import PreviewBox from "@/components/umbrella-tools/PreviewBox";
import { DevToolPageShell } from "@/components/umbrella-tools/DevToolPageShell";
import { generateBoxShadow } from "@/lib/umbrella-tools/css";

const TOOL_SLUG = "css-shadow-generator";

export default function CssShadowGeneratorTool() {
  const [offsetX, setOffsetX] = useState(4);
  const [offsetY, setOffsetY] = useState(8);
  const [blur, setBlur] = useState(24);
  const [spread, setSpread] = useState(0);
  const [color, setColor] = useState("rgba(0, 0, 0, 0.35)");

  const shadow = useMemo(
    () => generateBoxShadow({ offsetX, offsetY, blur, spread, color }),
    [offsetX, offsetY, blur, spread, color],
  );

  const cssSnippet = `box-shadow: ${shadow};`;

  return (
    <DevToolPageShell slug={TOOL_SLUG}>
      
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-5 rounded-xl border border-border bg-surface p-6">
          <Slider label="Offset X (px)" value={offsetX} onChange={setOffsetX} min={-80} max={80} />
          <Slider label="Offset Y (px)" value={offsetY} onChange={setOffsetY} min={-80} max={80} />
          <Slider label="Blur (px)" value={blur} onChange={setBlur} min={0} max={120} />
          <Slider label="Spread (px)" value={spread} onChange={setSpread} min={-40} max={40} />
          <div>
            <label className="mb-2 block text-sm font-medium text-muted-foreground">Color</label>
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="color"
                value={color.startsWith("#") ? color : "#000000"}
                onChange={(e) => setColor(e.target.value)}
                className="h-10 w-14 cursor-pointer rounded border border-border bg-transparent"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="min-w-[12rem] flex-1 rounded-lg border border-border bg-surface-elevated px-3 py-2 font-mono text-sm text-foreground"
                placeholder="rgba(0,0,0,0.35)"
              />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Use the picker for hex or type rgba() / hsla().</p>
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <h2 className="mb-2 text-sm font-medium text-muted-foreground">CSS</h2>
            <CodeBlock code={cssSnippet} language="css" />
          </div>
          <div>
            <h2 className="mb-2 text-sm font-medium text-muted-foreground">Preview</h2>
            <PreviewBox className="flex min-h-[220px] items-center justify-center bg-surface">
              <div
                className="h-28 w-28 rounded-2xl bg-surface-elevated border border-border"
                style={{ boxShadow: shadow }}
              />
            </PreviewBox>
          </div>
        </div>
      </div>
    </DevToolPageShell>
  );
}

function Slider({
  label,
  value,
  onChange,
  min,
  max,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
}) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono text-foreground">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary"
      />
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useDevToolsLocale } from "@/components/umbrella-tools/DevToolsLocaleProvider";
import CodeBlock from "@/components/umbrella-tools/CodeBlock";
import PreviewBox from "@/components/umbrella-tools/PreviewBox";
import {
  DEV_TOOL_PRIMARY_SURFACE_CLASS,
  DevToolPageShell,
} from "@/components/umbrella-tools/DevToolPageShell";
import { buildShapeDividerSvg, normalizeSvgFill, type DividerPreset } from "@/lib/umbrella-tools/shape-divider";
import { svgToDataURL } from "@/lib/umbrella-tools/svg";
import { getDevToolsHrefForLocale } from "@/lib/dev-tools-locale-path";

const TOOL_SLUG = "shape-divider-generator";

const PRESETS: { id: DividerPreset; label: string; hint: string }[] = [
  { id: "wave", label: "Wave", hint: "Smooth section wave" },
  { id: "curve", label: "Curve", hint: "Single arc" },
  { id: "tilt", label: "Tilt", hint: "Diagonal edge" },
  { id: "zigzag", label: "Zigzag", hint: "Alternating peaks" },
];

export default function ShapeDividerGeneratorTool() {
  const { locale } = useDevToolsLocale();
  const [preset, setPreset] = useState<DividerPreset>("wave");
  const [fill, setFill] = useState("#6366f1");
  const [width, setWidth] = useState(1200);
  const [height, setHeight] = useState(120);
  const [flip, setFlip] = useState(false);

  const svg = useMemo(
    () => buildShapeDividerSvg(preset, fill, width, height, flip),
    [preset, fill, width, height, flip],
  );

  const cssSnippet = useMemo(() => {
    const safe = svgToDataURL(svg);
    return `.divider {\n  background-image: ${safe};\n  background-repeat: no-repeat;\n  background-position: center;\n  background-size: cover;\n  height: ${height}px;\n}`;
  }, [svg, height]);

  const colorPickerValue = useMemo(() => {
    const h = normalizeSvgFill(fill);
    return /^#[0-9A-Fa-f]{6}$/i.test(h) ? h : "#6366f1";
  }, [fill]);

  return (
    <DevToolPageShell slug={TOOL_SLUG} showTryHeading={false}>
      <div className="space-y-8">
        <div className={DEV_TOOL_PRIMARY_SURFACE_CLASS}>
          <p className="text-muted-foreground">
            Build SVG section dividers for landing pages. Copy raw SVG or CSS{" "}
            <code className="rounded bg-muted px-1 font-mono text-[0.85em]">background-image</code> with a data URL. See also{" "}
            <Link
              href={getDevToolsHrefForLocale("/dev-tools/svg-to-css-background", locale)}
              className="font-medium text-primary underline-offset-2 hover:underline"
            >
              SVG → CSS background
            </Link>{" "}
            for any custom SVG.
          </p>

          <section
            className="mt-6 grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
            aria-labelledby="divider-controls-heading"
          >
          <h2 id="divider-controls-heading" className="sr-only">
            Divider options
          </h2>
          <div className="space-y-4">
            <div>
              <span className="text-sm font-medium text-muted-foreground">Shape</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPreset(p.id)}
                    title={p.hint}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                      preset === p.id
                        ? "border-primary bg-primary-muted text-foreground"
                        : "border-border bg-surface/50 text-muted-foreground hover:bg-muted/50"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            <label className="block text-sm font-medium text-muted-foreground">
              Fill color
              <div className="mt-1 flex items-center gap-3">
                <input
                  type="color"
                  value={colorPickerValue}
                  onChange={(e) => setFill(e.target.value)}
                  className="h-10 w-14 cursor-pointer rounded border border-border bg-background"
                  aria-label="Pick fill color"
                />
                <input
                  type="text"
                  value={fill}
                  onChange={(e) => setFill(e.target.value)}
                  placeholder="#6366f1"
                  className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 font-mono text-sm text-foreground"
                />
              </div>
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-muted-foreground">
                ViewBox width
                <input
                  type="number"
                  min={100}
                  max={4000}
                  step={50}
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value) || 1200)}
                  className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 font-mono text-sm text-foreground"
                />
              </label>
              <label className="block text-sm font-medium text-muted-foreground">
                ViewBox height
                <input
                  type="number"
                  min={40}
                  max={600}
                  step={10}
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value) || 120)}
                  className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 font-mono text-sm text-foreground"
                />
              </label>
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-foreground">
              <input type="checkbox" checked={flip} onChange={(e) => setFlip(e.target.checked)} />
              Flip horizontally (mirror)
            </label>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Preview</h3>
            <PreviewBox className="mt-2 overflow-hidden rounded-xl border border-border/60 p-0">
              <div
                className="w-full bg-muted/30"
                style={{ height: Math.min(height, 200) }}
                dangerouslySetInnerHTML={{ __html: svg }}
              />
            </PreviewBox>
          </div>
        </section>
        </div>

        <div className="grid min-w-0 gap-6 lg:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">SVG markup</h3>
            <div className="mt-2">
              <CodeBlock code={svg} language="xml" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">CSS snippet</h3>
            <div className="mt-2">
              <CodeBlock code={cssSnippet} language="css" />
            </div>
          </div>
        </div>
      </div>
    </DevToolPageShell>
  );
}

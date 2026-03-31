"use client";

import Link from "next/link";
import { useDevToolsLocale } from "@/components/umbrella-tools/DevToolsLocaleProvider";
import {
  DEV_TOOL_PRIMARY_SURFACE_CLASS,
  DevToolPageShell,
} from "@/components/umbrella-tools/DevToolPageShell";
import { getDevToolsHrefForLocale } from "@/lib/dev-tools-locale-path";

const TOOL_SLUG = "svg-generators";

const LINKS = [
  {
    href: "/dev-tools/svg-to-css-background",
    title: "SVG to CSS converter",
    description: "Paste inline SVG and get a data URL plus copy-ready background-image CSS.",
  },
  {
    href: "/dev-tools/shape-divider-generator",
    title: "Shape divider generator",
    description: "Wave, curve, tilt, and zigzag section dividers — export SVG or CSS.",
  },
] as const;

export default function SvgGeneratorsHubTool() {
  const { locale } = useDevToolsLocale();

  return (
    <DevToolPageShell slug={TOOL_SLUG} showTryHeading={false}>
      <div className={DEV_TOOL_PRIMARY_SURFACE_CLASS}>
        <p className="leading-relaxed text-muted-foreground">
          SVG utilities that run in your browser: convert graphics to CSS backgrounds and generate decorative section dividers
          for landing pages.
        </p>
        <ul className="mt-8 grid min-w-0 gap-4 sm:grid-cols-1 md:grid-cols-2">
        {LINKS.map((item) => (
          <li key={item.href}>
            <Link
              href={getDevToolsHrefForLocale(item.href, locale)}
              className="block rounded-xl border border-border/60 bg-surface/40 p-5 transition-colors hover:border-primary/40 hover:bg-surface/80"
            >
              <span className="font-display text-base font-semibold text-foreground">{item.title}</span>
              <span className="mt-2 block text-sm text-muted-foreground">{item.description}</span>
              <span className="mt-3 inline-block text-sm font-medium text-primary">Open tool →</span>
            </Link>
          </li>
        ))}
        </ul>
      </div>
    </DevToolPageShell>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import UmbrellaToolsLayout from "@/components/umbrella-tools/UmbrellaToolsLayout";
import { DevToolsToolCard } from "@/components/umbrella-tools/DevToolsToolCard";
import {
  DEV_TOOL_CATEGORY_LABELS,
  DEV_TOOL_CATEGORY_ORDER,
  UMBRELLA_TOOLS,
  toolsByCategory,
} from "@/lib/umbrella-tools/tools-config";
import { umbrellaToolsMetadata } from "@/lib/umbrella-tools/seo";

export async function generateMetadata(): Promise<Metadata> {
  return umbrellaToolsMetadata({
    title: "Developer utilities",
    description:
      "Free in-browser tools for developers: SVG to CSS backgrounds, JSON to CSV, CSS box-shadow generator. Private — runs locally in your browser.",
    path: "/dev-tools",
  });
}

export default function DevToolsIndexPage() {
  const toolCount = UMBRELLA_TOOLS.length;

  return (
    <UmbrellaToolsLayout>
      <section className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-b from-surface/60 via-background to-background px-6 py-12 sm:px-10 sm:py-14 lg:px-12">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_50%_-25%,var(--app-primary-muted),transparent)] opacity-90"
          aria-hidden
        />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Free · Client-side</p>
          <h1 className="mt-4 font-display text-3xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-4xl lg:text-[2.65rem]">
            Utilities that stay in your browser
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Quick helpers for CSS, data, and assets — no sign-up, no server round-trip for your pasted content. Add more
            tools here over time; this hub is built to scale.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-surface/50 px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-success" aria-hidden />
              {toolCount} tool{toolCount === 1 ? "" : "s"} available
            </span>
            <Link
              href="/dev-tools/about"
              className="inline-flex items-center rounded-full border border-border/60 bg-surface/50 px-4 py-2 font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              How we handle data →
            </Link>
          </div>
        </div>
      </section>

      <div className="mt-14 space-y-14 lg:mt-16 lg:space-y-16">
        {DEV_TOOL_CATEGORY_ORDER.map((category) => {
          const tools = toolsByCategory(category);
          if (tools.length === 0) return null;
          return (
            <section key={category} aria-labelledby={`dev-tools-cat-${category}`}>
              <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <h2
                  id={`dev-tools-cat-${category}`}
                  className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl"
                >
                  {DEV_TOOL_CATEGORY_LABELS[category]}
                </h2>
                <p className="max-w-md text-sm text-muted-foreground">
                  {category === "css" && "Visual tweaks with instant preview and copy-ready output."}
                  {category === "data" && "Structured conversions without uploading files to our servers."}
                  {category === "graphics" && "Asset pipelines from markup to production CSS."}
                </p>
              </div>
              <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                {tools.map((tool) => (
                  <li key={tool.slug}>
                    <DevToolsToolCard tool={tool} />
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <aside className="mt-16 rounded-2xl border border-dashed border-border/70 bg-surface/30 p-8 text-center lg:mt-20">
        <p className="font-display text-lg font-semibold text-foreground">More utilities on the roadmap</p>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
          We&apos;ll keep adding small, focused tools. If you have a request, say hello via{" "}
          <Link href="/contact" className="font-medium text-primary underline-offset-2 hover:underline">
            contact
          </Link>
          .
        </p>
      </aside>
    </UmbrellaToolsLayout>
  );
}

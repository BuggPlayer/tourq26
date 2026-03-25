import type { Metadata } from "next";
import Link from "next/link";
import UmbrellaToolsLayout from "@/components/umbrella-tools/UmbrellaToolsLayout";
import { UMBRELLA_TOOLS } from "@/lib/umbrella-tools/tools-config";
import { umbrellaToolsMetadata } from "@/lib/umbrella-tools/seo";

export async function generateMetadata(): Promise<Metadata> {
  return umbrellaToolsMetadata({
    title: "Developer utilities",
    description:
      "Free client-side utilities: SVG to CSS background, JSON to CSV, and a CSS box-shadow generator. Runs in your browser.",
    path: "/dev-tools",
  });
}

export default function DevToolsIndexPage() {
  return (
    <UmbrellaToolsLayout>
      <header className="mb-10">
        <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">Developer utilities</h1>
        <p className="mt-3 max-w-2xl text-[var(--color-muted)]">
          Small, private tools that run entirely in your browser — no server processing. Also see our{" "}
          <Link href="/tools" className="text-[var(--color-primary)] hover:underline">
            AI-assisted tools
          </Link>
          .
        </p>
      </header>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {UMBRELLA_TOOLS.map((tool) => (
          <li key={tool.slug}>
            <Link
              href={`/dev-tools/${tool.slug}`}
              className="block h-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-colors hover:border-[var(--color-primary)]/40 hover:bg-[var(--color-surface-elevated)]"
            >
              <h2 className="font-display text-lg font-semibold text-white">{tool.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">{tool.description}</p>
              <span className="mt-4 inline-block text-sm font-medium text-[var(--color-primary)]">Open →</span>
            </Link>
          </li>
        ))}
      </ul>
    </UmbrellaToolsLayout>
  );
}

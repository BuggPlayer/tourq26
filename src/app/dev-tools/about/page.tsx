import type { Metadata } from "next";
import Link from "next/link";
import UmbrellaToolsLayout from "@/components/umbrella-tools/UmbrellaToolsLayout";
import { umbrellaToolsMetadata } from "@/lib/umbrella-tools/seo";

export async function generateMetadata(): Promise<Metadata> {
  return umbrellaToolsMetadata({
    title: "About developer utilities",
    description: "What the Torq Studio in-browser developer utilities are and how we handle your data.",
    path: "/dev-tools/about",
  });
}

export default function DevToolsAboutPage() {
  return (
    <UmbrellaToolsLayout>
      <article className="prose prose-invert max-w-2xl prose-headings:font-display prose-p:text-[var(--color-muted)] prose-li:text-[var(--color-muted)]">
        <h1 className="text-3xl font-bold text-white">About these utilities</h1>
        <p>
          This section hosts small developer helpers — SVG backgrounds, JSON to CSV, and CSS shadows. They are built
          for quick, repeatable tasks without leaving the site.
        </p>
        <p>
          Processing happens in your browser. We do not send your pasted or uploaded content to our servers for these
          utilities. See the{" "}
          <Link href="/privacy" className="text-[var(--color-primary)] hover:underline">
            privacy policy
          </Link>{" "}
          for how we handle data elsewhere on the site.
        </p>
        <p>
          <Link href="/dev-tools" className="text-[var(--color-primary)] hover:underline">
            ← Back to utilities
          </Link>
        </p>
      </article>
    </UmbrellaToolsLayout>
  );
}

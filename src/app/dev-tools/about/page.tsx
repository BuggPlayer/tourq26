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
      <header className="mb-10 max-w-2xl border-b border-border/40 pb-10">
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">About these utilities</h1>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          Small, focused tools for everyday dev tasks — built to run without sending your input to our servers.
        </p>
      </header>
      <article className="blog-article max-w-2xl text-[1.02rem]">
        <p>
          Tools are grouped by category (Text, URL, CSS, JSON, CSV, and more). Today you&apos;ll find JSON formatting,
          JWT inspection, Base64 and URL encoding, SHA hashing, UUID and timestamp helpers, SVG→CSS backgrounds,
          JSON→CSV, and a CSS box-shadow generator — all designed for quick work without leaving the site.
        </p>
        <p>
          Processing happens in your browser. We do not send your pasted or uploaded content to our servers for these
          utilities. See the{" "}
          <Link href="/privacy" className="font-medium text-primary underline-offset-2 hover:underline">
            privacy policy
          </Link>{" "}
          for how we handle data elsewhere on the site.
        </p>
        <p>
          <Link href="/dev-tools" className="font-medium text-primary underline-offset-2 hover:underline">
            ← Back to all tools
          </Link>
        </p>
      </article>
    </UmbrellaToolsLayout>
  );
}

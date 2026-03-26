import type { Metadata } from "next";
import Link from "next/link";
import UmbrellaToolsLayout from "@/components/umbrella-tools/UmbrellaToolsLayout";
import { DevToolsToolCard } from "@/components/umbrella-tools/DevToolsToolCard";
import JsonLd from "@/components/JsonLd";
import { readDevToolsAdminDocument, readSiteContent } from "@/lib/content";
import { isFeatureEnabled } from "@/lib/feature-flags";
import {
  filterUmbrellaToolsByAdmin,
  isDevToolFeatured,
  sortUmbrellaToolsForHub,
} from "@/lib/dev-tools-admin";
import {
  DEV_TOOL_CATEGORY_BLURB,
  DEV_TOOL_CATEGORY_LABELS,
  DEV_TOOL_CATEGORY_ORDER,
  filterCodePlaygroundFromCatalog,
  UMBRELLA_TOOLS,
  toolsByCategory,
} from "@/lib/umbrella-tools/tools-config";
import { devToolsHubPageJsonLd, DEV_TOOLS_OG_IMAGE_PATH, umbrellaToolsMetadata } from "@/lib/umbrella-tools/seo";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return umbrellaToolsMetadata({
    title: "Free dev tools online",
    description:
      "Free developer tools online — JSON, Base64, SHA/HMAC, bcrypt, QR, CIDR, encodings & URL utilities. No account; everything runs locally in your browser.",
    path: "/dev-tools",
    keywords: [
      "free developer tools",
      "free dev tools online",
      "developer tools online",
      "online developer utilities",
      "browser developer tools",
      "text tools",
      "url tools",
      "json tools",
      "csv tools",
      "css tools",
      "yaml tools",
      "markdown tools",
      "php tools online",
      "database url parser",
      "bcrypt online",
      "qr code generator",
      "cidr calculator",
      "hmac generator",
    ],
    ogImagePath: DEV_TOOLS_OG_IMAGE_PATH,
  });
}

export default async function DevToolsIndexPage() {
  const adminDoc = await readDevToolsAdminDocument();
  const playgroundOn = await isFeatureEnabled("dev_tools_code_playground");
  const catalogTools = filterCodePlaygroundFromCatalog(UMBRELLA_TOOLS, playgroundOn);
  const toolsForHub = sortUmbrellaToolsForHub(filterUmbrellaToolsByAdmin(catalogTools, adminDoc), adminDoc);
  const toolCount = filterUmbrellaToolsByAdmin(catalogTools, adminDoc).length;
  const [siteUrl, site] = await Promise.all([getSiteUrl(), readSiteContent()]);
  const hubLd = devToolsHubPageJsonLd(siteUrl, site.siteName, toolsForHub);

  return (
    <UmbrellaToolsLayout catalogTools={catalogTools}>
      <JsonLd data={hubLd} />
      <section className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-b from-surface/50 via-background to-background px-6 py-10 sm:px-10 sm:py-12 lg:px-12">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_50%_-25%,var(--app-primary-muted),transparent)] opacity-90"
          aria-hidden
        />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Free · Client-side · No signup</p>
          <h1 className="mt-4 font-display text-3xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-4xl lg:text-[2.65rem]">
            Free online developer tools
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Use JSON, Base64, hashing, encodings, QR, network, and text utilities — all processed in your browser. No
            account required.
          </p>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Browse by category: Text, URL, HTML, CSS, JSON, CSV, database, crypto, YAML, and more.
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground/90">
            Includes database URL parsing, random strings, Base32/Base58/Base64, SHA and HMAC, bcrypt, QR codes, and IPv4
            CIDR — all free dev tools that run locally.
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
          const tools = sortUmbrellaToolsForHub(
            filterUmbrellaToolsByAdmin(toolsByCategory(category), adminDoc),
            adminDoc,
          );
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
                <p className="max-w-md text-sm text-muted-foreground">{DEV_TOOL_CATEGORY_BLURB[category]}</p>
              </div>
              <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                {tools.map((tool) => (
                  <li key={tool.slug}>
                    <DevToolsToolCard tool={tool} featured={isDevToolFeatured(tool.slug, adminDoc)} />
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <aside className="mt-16 rounded-2xl border border-dashed border-border/70 bg-surface/30 p-8 text-center lg:mt-20">
        <p className="font-display text-lg font-semibold text-foreground">Expanding by category</p>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
          We&apos;re growing HTML, Markdown, JavaScript, XML, YAML, and PHP utilities further. Request a tool via{" "}
          <Link href="/contact" className="font-medium text-primary underline-offset-2 hover:underline">
            contact
          </Link>
          .
        </p>
      </aside>
    </UmbrellaToolsLayout>
  );
}

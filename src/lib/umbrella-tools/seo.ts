import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site-url";
import { readSiteContent } from "@/lib/content";

const DEFAULT_SUFFIX = "Developer utilities";

/**
 * Build Next.js metadata for umbrella / dev-tools pages (App Router).
 */
export async function umbrellaToolsMetadata(opts: {
  title: string;
  description: string;
  path: string;
}): Promise<Metadata> {
  const [baseUrl, site] = await Promise.all([getSiteUrl(), readSiteContent()]);
  const path = opts.path.startsWith("/") ? opts.path : `/${opts.path}`;
  const url = `${baseUrl}${path}`;
  const pageTitle = `${opts.title} | ${DEFAULT_SUFFIX} | ${site.siteName}`;
  return {
    title: pageTitle,
    description: opts.description,
    alternates: { canonical: url },
    openGraph: {
      title: pageTitle,
      description: opts.description,
      url,
      siteName: site.siteName,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: opts.description,
    },
  };
}

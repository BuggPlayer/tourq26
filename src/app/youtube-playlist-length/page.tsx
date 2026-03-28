import type { Metadata } from "next";
import { Suspense } from "react";
import JsonLd from "@/components/JsonLd";
import { PlaylistLengthFaq } from "@/components/youtube-playlist-length/PlaylistLengthFaq";
import {
  YouTubeToolFooter,
  YouTubeToolHeader,
} from "@/components/youtube-playlist-length/YouTubeToolChrome";
import { YouTubePlaylistLengthClient } from "@/components/youtube-playlist-length/YouTubePlaylistLengthClient";
import { breadcrumbListJsonLd } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site-url";

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = await getSiteUrl();
  const canonical = `${baseUrl}/youtube-playlist-length`;
  const title = "YouTube Playlist Length Calculator";
  const description =
    "Calculate total watch time for any public YouTube playlist. Supports ranges, playback speed, sorting by views, likes, or duration, and shareable links. Free online tool.";
  return {
    title,
    description,
    keywords: [
      "YouTube playlist length",
      "playlist duration calculator",
      "total watch time",
      "YouTube API",
      "playlist time",
      "binge watch calculator",
    ],
    alternates: { canonical },
    openGraph: {
      title: `${title} | Torq Studio`,
      description,
      url: canonical,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Torq Studio`,
      description,
    },
    robots: { index: true, follow: true },
  };
}

function PlaylistToolSkeleton() {
  return (
    <div className="animate-pulse space-y-4" aria-hidden>
      <div className="h-24 rounded-xl bg-muted/25" />
      <div className="space-y-3 rounded-xl border border-border/40 bg-surface-elevated/30 p-4 sm:p-5">
        <div className="h-5 w-48 rounded-md bg-muted/35" />
        <div className="h-3 w-full max-w-md rounded-md bg-muted/25" />
        <div className="h-12 w-full rounded-xl bg-muted/30" />
        <div className="h-40 rounded-2xl bg-muted/20" />
        <div className="flex gap-3">
          <div className="h-12 w-40 rounded-xl bg-muted/35" />
          <div className="h-12 w-36 rounded-xl bg-muted/25" />
        </div>
      </div>
    </div>
  );
}

export default async function YouTubePlaylistLengthPage() {
  const siteUrl = await getSiteUrl();
  const breadcrumbLd = breadcrumbListJsonLd(siteUrl, [
    { name: "Home", path: "/" },
    { name: "YouTube playlist length", path: "/youtube-playlist-length" },
  ]);

  const webAppLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "YouTube Playlist Length Calculator",
    url: `${siteUrl}/youtube-playlist-length`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web browser",
    browserRequirements: "Requires JavaScript",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    isAccessibleForFree: true,
    description:
      "Compute total duration, averages, and per-video stats for YouTube playlists with optional range and playback speed.",
  };

  return (
    <>
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={webAppLd} />
      <YouTubeToolHeader />
      <main className="yt-pl-main flex flex-1 flex-col">
        <div className="mx-auto w-full max-w-5xl px-3 py-3 sm:px-5 sm:py-5">
          <header className="mb-4 border-b border-border/50 pb-3 sm:mb-5 sm:pb-4">
            <h1 className="text-lg font-bold leading-tight tracking-tight text-foreground sm:text-xl">
              Playlist length calculator
            </h1>
            <p className="mt-1 max-w-2xl text-xs leading-snug text-muted-foreground sm:text-sm">
              Total watch time, sorting, and CSV export for any public playlist — paste a link below.
            </p>
          </header>
          <Suspense fallback={<PlaylistToolSkeleton />}>
            <YouTubePlaylistLengthClient />
          </Suspense>
          <div className="mt-8 border-t border-border/50 pt-8 sm:mt-10 sm:pt-10">
            <PlaylistLengthFaq />
          </div>
        </div>
      </main>
      <YouTubeToolFooter />
    </>
  );
}

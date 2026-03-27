import type { Metadata } from "next";
import { Suspense } from "react";
import MarketingHeader from "@/components/MarketingHeader";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { PlaylistLengthFaq } from "@/components/youtube-playlist-length/PlaylistLengthFaq";
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
    <div className="animate-pulse space-y-8" aria-hidden>
      <div className="h-28 rounded-2xl bg-muted/25" />
      <div className="space-y-4 rounded-2xl border border-border/40 bg-surface-elevated/20 p-6 sm:p-8">
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
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description:
      "Compute total duration, averages, and per-video stats for YouTube playlists with optional range and playback speed.",
  };

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={webAppLd} />
      <MarketingHeader />
      <main>
        <header className="gradient-mesh relative border-b border-border/40 px-4 pt-28 pb-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-surface-elevated/40 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
              Free · no sign-in
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl">
              YouTube playlist length calculator
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Total watch time, averages, and a sortable list — with optional range, playback speed, and shareable links.
            </p>
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <Suspense fallback={<PlaylistToolSkeleton />}>
            <YouTubePlaylistLengthClient />
          </Suspense>
          <div className="mt-16">
            <PlaylistLengthFaq />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

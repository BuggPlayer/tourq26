import Script from "next/script";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-yt-playlist",
  display: "swap",
});

export default function YouTubePlaylistLengthLayout({ children }: { children: React.ReactNode }) {
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  return (
    <>
      {plausibleDomain ? (
        <Script
          defer
          data-domain={plausibleDomain}
          src="https://plausible.io/js/script.js"
          strategy="lazyOnload"
        />
      ) : null}
      <div
        className={`yt-playlist-tool flex min-h-screen flex-col bg-background text-foreground antialiased ${roboto.variable}`}
      >
        {children}
      </div>
    </>
  );
}

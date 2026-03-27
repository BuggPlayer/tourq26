import Script from "next/script";

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
      {children}
    </>
  );
}

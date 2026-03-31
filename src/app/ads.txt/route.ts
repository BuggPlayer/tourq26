import { NextResponse } from "next/server";

/**
 * Google AdSense (and other ads.txt) seller declarations.
 *
 * Set either:
 * - `ADS_TXT` — full file body (multiple lines allowed), or
 * - `GOOGLE_ADSENSE_PUBLISHER_ID` — `pub-XXXXXXXXXXXXXXXX` (or digits only); builds the standard Google line.
 *
 * If neither is set, returns 404 so you do not publish a placeholder that could confuse crawlers.
 *
 * @see https://support.google.com/adsense/answer/7532444
 */
function buildAdsTxtBody(): string | null {
  const raw = process.env.ADS_TXT?.trim();
  if (raw) return raw;

  const pub = process.env.GOOGLE_ADSENSE_PUBLISHER_ID?.trim();
  if (!pub) return null;

  const id = pub.startsWith("pub-") ? pub : `pub-${pub}`;
  return `google.com, ${id}, DIRECT, f08c47fec0942fa0`;
}

export async function GET() {
  const body = buildAdsTxtBody();
  if (!body) {
    return new NextResponse(null, { status: 404 });
  }

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}

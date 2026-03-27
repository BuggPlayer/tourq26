/** Parse YouTube `contentDetails.duration` ISO 8601 (e.g. PT1H2M3S, P1DT2H) to seconds. */
export function parseIso8601Duration(iso: string): number {
  if (!iso || typeof iso !== "string") return 0;

  const weeks = iso.match(/^P(\d+)W$/);
  if (weeks) {
    return (parseInt(weeks[1], 10) || 0) * 604800;
  }

  const withDays = iso.match(/^P(\d+)D(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/);
  if (withDays) {
    const d = parseInt(withDays[1], 10) || 0;
    const h = parseInt(withDays[2] || "0", 10) || 0;
    const m = parseInt(withDays[3] || "0", 10) || 0;
    const s = parseInt(withDays[4] || "0", 10) || 0;
    return d * 86400 + h * 3600 + m * 60 + s;
  }

  const plain = iso.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (plain) {
    const h = parseInt(plain[1] || "0", 10) || 0;
    const m = parseInt(plain[2] || "0", 10) || 0;
    const s = parseInt(plain[3] || "0", 10) || 0;
    return h * 3600 + m * 60 + s;
  }

  return 0;
}

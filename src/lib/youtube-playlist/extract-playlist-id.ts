/**
 * Extract YouTube playlist ID from common URL shapes and bare IDs.
 * Supports playlist URLs, watch URLs with `list=`, and mobile hosts.
 */
export function extractPlaylistId(raw: string): string | null {
  const input = raw.trim();
  if (!input) return null;

  const bare = input.replace(/^["']|["']$/g, "").trim();
  /* YouTube playlist IDs are alphanumeric + `_` / `-` (length varies; PL… is common). */
  if (/^[a-zA-Z0-9_-]{10,}$/.test(bare) && !bare.includes("/") && !bare.includes("?")) {
    return bare;
  }

  let urlStr = bare;
  if (!/^https?:\/\//i.test(urlStr)) {
    urlStr = `https://${urlStr}`;
  }

  try {
    const u = new URL(urlStr);
    const host = u.hostname.replace(/^www\./, "").toLowerCase();

    const list = u.searchParams.get("list");
    if (list && /^[a-zA-Z0-9_-]+$/.test(list)) {
      return list;
    }

    if (
      (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") &&
      u.pathname.startsWith("/playlist")
    ) {
      const pList = u.searchParams.get("list");
      if (pList && /^[a-zA-Z0-9_-]+$/.test(pList)) return pList;
    }

    return null;
  } catch {
    return null;
  }
}

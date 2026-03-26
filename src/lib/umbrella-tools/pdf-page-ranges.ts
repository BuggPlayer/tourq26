/**
 * Parse 1-based page lists like "1-3, 5, 7-9" into unique 0-based indices (sorted).
 */
export function parsePageRanges(input: string, totalPages: number): number[] {
  const set = new Set<number>();
  const trimmed = input.trim();
  if (!trimmed || totalPages < 1) return [];
  for (const part of trimmed
    .split(/[,;]+/)
    .map((s) => s.trim())
    .filter(Boolean)) {
    if (part.includes("-")) {
      const [a, b] = part.split("-", 2).map((x) => parseInt(x.trim(), 10));
      if (Number.isNaN(a) || Number.isNaN(b)) continue;
      const lo = Math.min(a, b);
      const hi = Math.max(a, b);
      for (let p = lo; p <= hi; p++) {
        if (p >= 1 && p <= totalPages) set.add(p - 1);
      }
    } else {
      const p = parseInt(part, 10);
      if (!Number.isNaN(p) && p >= 1 && p <= totalPages) set.add(p - 1);
    }
  }
  return [...set].sort((a, b) => a - b);
}

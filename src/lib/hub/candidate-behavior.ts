/**
 * Lightweight client-side behavior for /hub/candidate personalization.
 * No PII — paths and question ids only, stored in localStorage.
 */

const STORAGE_KEY = "torq-candidate-behavior";
const MAX_RECENT_PATHS = 12;
const MAX_RECENT_NODE_QA = 10;

export type CandidateBehaviorV1 = {
  v: 1;
  /** path -> visit count */
  pathCounts: Record<string, number>;
  recentPaths: { path: string; at: number }[];
  recentNodeQaIds: { id: string; at: number }[];
};

const defaultState = (): CandidateBehaviorV1 => ({
  v: 1,
  pathCounts: {},
  recentPaths: [],
  recentNodeQaIds: [],
});

export function readCandidateBehavior(): CandidateBehaviorV1 {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const p = JSON.parse(raw) as Partial<CandidateBehaviorV1>;
    if (p?.v !== 1) return defaultState();
    return {
      v: 1,
      pathCounts: typeof p.pathCounts === "object" && p.pathCounts ? p.pathCounts : {},
      recentPaths: Array.isArray(p.recentPaths) ? p.recentPaths : [],
      recentNodeQaIds: Array.isArray(p.recentNodeQaIds) ? p.recentNodeQaIds : [],
    };
  } catch {
    return defaultState();
  }
}

export function writeCandidateBehavior(next: CandidateBehaviorV1): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* quota / private mode */
  }
}

export function recordCandidatePath(path: string): CandidateBehaviorV1 {
  const b = readCandidateBehavior();
  const now = Date.now();
  b.pathCounts[path] = (b.pathCounts[path] ?? 0) + 1;
  b.recentPaths = [
    { path, at: now },
    ...b.recentPaths.filter((x) => x.path !== path),
  ].slice(0, MAX_RECENT_PATHS);
  writeCandidateBehavior(b);
  return b;
}

export function recordNodeQaFullPageView(questionId: string): CandidateBehaviorV1 {
  const b = readCandidateBehavior();
  const now = Date.now();
  b.recentNodeQaIds = [
    { id: questionId, at: now },
    ...b.recentNodeQaIds.filter((x) => x.id !== questionId),
  ].slice(0, MAX_RECENT_NODE_QA);
  writeCandidateBehavior(b);
  return b;
}

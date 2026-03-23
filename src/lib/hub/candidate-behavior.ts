/**
 * Lightweight client-side behavior for /hub/candidate personalization.
 * No PII — paths and question ids only, stored in localStorage.
 */

const STORAGE_KEY = "torq-candidate-behavior";
const MAX_RECENT_PATHS = 12;
const MAX_RECENT_INTERVIEW_QA = 10;

export type CandidateBehaviorV1 = {
  v: 1;
  /** path -> visit count */
  pathCounts: Record<string, number>;
  recentPaths: { path: string; at: number }[];
  /** Per-bank full-page Q&A views (newest first). */
  recentInterviewQa: { bankSlug: string; id: string; at: number }[];
  /** @deprecated migrated into recentInterviewQa on read */
  recentNodeQaIds?: { id: string; at: number }[];
};

const defaultState = (): CandidateBehaviorV1 => ({
  v: 1,
  pathCounts: {},
  recentPaths: [],
  recentInterviewQa: [],
});

function migrateFromLegacy(p: Partial<CandidateBehaviorV1>): CandidateBehaviorV1 {
  let recentInterviewQa = Array.isArray(p.recentInterviewQa) ? [...p.recentInterviewQa] : [];
  if (recentInterviewQa.length === 0 && Array.isArray(p.recentNodeQaIds)) {
    recentInterviewQa = p.recentNodeQaIds.map((x) => ({
      bankSlug: "nodejs",
      id: x.id,
      at: x.at,
    }));
  }
  return {
    v: 1,
    pathCounts: typeof p.pathCounts === "object" && p.pathCounts ? p.pathCounts : {},
    recentPaths: Array.isArray(p.recentPaths) ? p.recentPaths : [],
    recentInterviewQa,
  };
}

export function readCandidateBehavior(): CandidateBehaviorV1 {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const p = JSON.parse(raw) as Partial<CandidateBehaviorV1>;
    if (p?.v !== 1) return defaultState();
    return migrateFromLegacy(p);
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

export function recordInterviewQaFullPageView(
  bankSlug: string,
  questionId: string,
): CandidateBehaviorV1 {
  const b = readCandidateBehavior();
  const now = Date.now();
  const key = `${bankSlug}:${questionId}`;
  b.recentInterviewQa = [
    { bankSlug, id: questionId, at: now },
    ...b.recentInterviewQa.filter((x) => `${x.bankSlug}:${x.id}` !== key),
  ].slice(0, MAX_RECENT_INTERVIEW_QA);
  writeCandidateBehavior(b);
  return b;
}

/** @deprecated use recordInterviewQaFullPageView("nodejs", id) */
export function recordNodeQaFullPageView(questionId: string): CandidateBehaviorV1 {
  return recordInterviewQaFullPageView("nodejs", questionId);
}

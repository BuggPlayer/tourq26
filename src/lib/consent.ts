/** localStorage key for cookie consent (analytics + optional ads-related storage flags). */
export const CONSENT_STORAGE_KEY = "torq_consent_v1";

export type ConsentChoice = "accepted" | "rejected";

export function getStoredConsent(): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (raw === "accepted" || raw === "rejected") return raw;
  } catch {
    /* private mode */
  }
  return null;
}

export function setStoredConsent(choice: ConsentChoice): void {
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  } catch {
    /* */
  }
}

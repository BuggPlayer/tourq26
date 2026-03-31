/** Google tag (gtag.js) + dataLayer — Consent Mode v2 + GA4. */
export {};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

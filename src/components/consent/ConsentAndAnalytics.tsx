"use client";

import Link from "next/link";
import Script from "next/script";
import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getStoredConsent, setStoredConsent } from "@/lib/consent";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID?.trim();

const hasTrackingConfig = Boolean(GA_ID || CLARITY_ID);

function applyConsentGranted(): void {
  if (typeof window.gtag !== "function") return;
  window.gtag("consent", "update", {
    ad_storage: "granted",
    ad_user_data: "granted",
    ad_personalization: "granted",
    analytics_storage: "granted",
    functionality_storage: "granted",
    personalization_storage: "granted",
  });
}

function clarityInlineScript(projectId: string): string {
  const id = JSON.stringify(projectId);
  return `(function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", ${id});`;
}

/**
 * Cookie banner + Google Analytics 4 + Microsoft Clarity after opt-in.
 * Skips UI and third-party loads on `/admin`. No-op if no public env IDs are set.
 */
export function ConsentAndAnalytics() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const [mounted, setMounted] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [enableScripts, setEnableScripts] = useState(false);
  const [gaReady, setGaReady] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !hasTrackingConfig || isAdmin) return;
    const choice = getStoredConsent();
    if (choice === "accepted") {
      applyConsentGranted();
      setEnableScripts(true);
      return;
    }
    if (choice === "rejected") return;
    setShowBanner(true);
  }, [mounted, isAdmin]);

  useEffect(() => {
    if (!gaReady || !GA_ID || typeof window.gtag !== "function") return;
    window.gtag("config", GA_ID, {
      page_path: pathname,
    });
  }, [pathname, gaReady]);

  const accept = useCallback(() => {
    setStoredConsent("accepted");
    applyConsentGranted();
    setShowBanner(false);
    setEnableScripts(true);
  }, []);

  const reject = useCallback(() => {
    setStoredConsent("rejected");
    setShowBanner(false);
  }, []);

  if (!hasTrackingConfig || isAdmin) return null;

  return (
    <>
      {enableScripts && GA_ID ? (
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
          onLoad={() => {
            window.dataLayer = window.dataLayer || [];
            window.gtag = function gtag(...args: unknown[]) {
              window.dataLayer?.push(args);
            };
            window.gtag("js", new Date());
            window.gtag("config", GA_ID, { send_page_view: false });
            setGaReady(true);
          }}
        />
      ) : null}

      {enableScripts && CLARITY_ID ? (
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {clarityInlineScript(CLARITY_ID)}
        </Script>
      ) : null}

      {showBanner && mounted ? (
        <div
          className="fixed bottom-0 left-0 right-0 z-[100] border-t border-border/80 bg-background/95 p-4 shadow-[0_-8px_32px_rgba(0,0,0,0.12)] backdrop-blur-md supports-[backdrop-filter]:bg-background/90 md:p-5"
          role="dialog"
          aria-labelledby="cookie-consent-title"
          aria-describedby="cookie-consent-desc"
        >
          <div className="mx-auto flex max-w-4xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <div className="min-w-0 text-sm leading-relaxed text-muted-foreground">
              <p id="cookie-consent-title" className="font-semibold text-foreground">
                Cookies & analytics
              </p>
              <p id="cookie-consent-desc" className="mt-1">
                We use cookies and similar technologies to measure traffic and improve the site. With your consent we may
                load Google Analytics and Microsoft Clarity. See our{" "}
                <Link href="/privacy" className="font-medium text-primary underline-offset-2 hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
              <button
                type="button"
                onClick={reject}
                className="rounded-lg border border-border/70 bg-transparent px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-elevated"
              >
                Reject
              </button>
              <button
                type="button"
                onClick={accept}
                className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-95"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

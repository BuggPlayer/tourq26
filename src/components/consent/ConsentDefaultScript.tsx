import Script from "next/script";

/**
 * Google Consent Mode v2 defaults (denied) before any tag loads.
 * @see https://developers.google.com/tag-platform/security/guides/consent
 */
export function ConsentDefaultScript() {
  return (
    <Script id="consent-default" strategy="beforeInteractive">
      {`
(function(){
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  window.gtag = window.gtag || gtag;
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'denied',
    personalization_storage: 'denied',
    security_storage: 'granted',
    wait_for_update: 500
  });
})();
      `}
    </Script>
  );
}

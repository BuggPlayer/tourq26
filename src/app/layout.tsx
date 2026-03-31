import type { Metadata, Viewport } from "next";
import { DM_Sans, Outfit } from "next/font/google";
import "./globals.css";
import { readSiteContent } from "@/lib/content";
import { ConsentAndAnalytics } from "@/components/consent/ConsentAndAnalytics";
import { ConsentDefaultScript } from "@/components/consent/ConsentDefaultScript";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { ThemeShell } from "@/components/theme/ThemeShell";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { SITE_THEME_STORAGE_KEY } from "@/lib/theme-storage";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#07090e" },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const site = await readSiteContent();
  const siteUrl = site.siteUrl.replace(/\/$/, "");
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: site.defaultTitle,
      template: site.titleTemplate,
    },
    description: site.defaultDescription,
    keywords: site.keywords?.length ? site.keywords : undefined,
    authors: [{ name: site.siteName, url: siteUrl }],
    creator: site.siteName,
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteUrl,
      siteName: site.siteName,
      title: site.ogTitle,
      description: site.ogDescription,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: `${site.siteName} | Your Trusted Technology Partner`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: site.twitterTitle,
      description: site.twitterDescription,
      images: ["/opengraph-image"],
      ...(site.twitterSite
        ? { site: `@${site.twitterSite}`, creator: `@${site.twitterSite}` }
        : {}),
    },
    alternates: { canonical: siteUrl },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [site, showWhatsApp] = await Promise.all([
    readSiteContent(),
    isFeatureEnabled("floating_whatsapp"),
  ]);
  const siteUrl = site.siteUrl.replace(/\/$/, "");

  const showConsentAndTracking = Boolean(
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ||
      process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID?.trim(),
  );

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.siteName,
    url: siteUrl,
    description: site.defaultDescription,
    areaServed: "Worldwide",
    ...(site.sameAs?.length ? { sameAs: site.sameAs } : {}),
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.siteName,
    url: siteUrl,
    description: site.defaultDescription,
    publisher: { "@type": "Organization", name: site.siteName, url: siteUrl },
    inLanguage: "en-US",
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Before paint: match next-themes + defaultTheme=&quot;system&quot; to avoid wrong-theme flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var k=${JSON.stringify(SITE_THEME_STORAGE_KEY)};var t=localStorage.getItem(k);var d=document.documentElement;if(t==='light'||t==='dark'){d.classList.add(t);}else{if(window.matchMedia('(prefers-color-scheme: light)').matches)d.classList.add('light');else d.classList.add('dark');}}catch(e){}})();`,
          }}
        />
        {showConsentAndTracking ? <ConsentDefaultScript /> : null}
      </head>
      <body className={`${dmSans.variable} ${outfit.variable} font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <ThemeShell>
          {children}
          {showWhatsApp ? <FloatingWhatsApp /> : null}
          {showConsentAndTracking ? <ConsentAndAnalytics /> : null}
        </ThemeShell>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { DM_Sans, Outfit } from "next/font/google";
import "./globals.css";
import { readSiteContent } from "@/lib/content";

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
  themeColor: "#07090e",
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
    },
    alternates: { canonical: siteUrl },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const site = await readSiteContent();
  const siteUrl = site.siteUrl.replace(/\/$/, "");

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.siteName,
    url: siteUrl,
    description: site.defaultDescription,
    areaServed: "Worldwide",
    sameAs: [],
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.siteName,
    url: siteUrl,
    description: site.defaultDescription,
    publisher: { "@type": "Organization", name: site.siteName, url: siteUrl },
    inLanguage: "en-US",
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${siteUrl}/?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${outfit.variable} font-sans antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}

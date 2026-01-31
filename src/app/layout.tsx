import type { Metadata, Viewport } from "next";
import { DM_Sans, Outfit } from "next/font/google";
import "./globals.css";

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

const siteUrl = "https://torqstudio.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Torq Studio | Your Trusted Technology Partner | Global",
    template: "%s | Torq Studio",
  },
  description:
    "We help businesses worldwide scale smarter and faster. Mobile & web development, AI solutions, remote IT resources. Reduce costs by up to 40%. On-time delivery, quality assurance.",
  keywords: [
    "software development",
    "mobile app development",
    "web development",
    "AI solutions",
    "global",
    "worldwide",
    "remote IT",
    "Torq Studio",
    "technology partner",
  ],
  authors: [{ name: "Torq Studio", url: siteUrl }],
  creator: "Torq Studio",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Torq Studio",
    title: "Torq Studio | Technology Partner for Growth",
    description: "Crafting solutions that inspire growth & innovation. Serving clients globally.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Torq Studio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Torq Studio | Technology Partner for Growth",
    description: "Crafting solutions that inspire growth & innovation.",
  },
  alternates: { canonical: siteUrl },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0c0f17",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Torq Studio",
  url: siteUrl,
  description:
    "Your trusted technology partner. We help businesses worldwide scale smarter with mobile apps, web development, AI solutions, and remote IT resources.",
  areaServed: "Worldwide",
  sameAs: [],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${outfit.variable} font-sans antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}

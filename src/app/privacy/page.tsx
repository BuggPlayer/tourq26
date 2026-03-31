import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { PrivacyDevToolsLink } from "@/components/PrivacyDevToolsLink";
import { getSiteUrl } from "@/lib/site-url";
import { breadcrumbListJsonLd } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = await getSiteUrl();
  return {
    title: "Privacy Policy",
    description:
      "Torq Studio privacy policy. How we collect, use, and protect your data. GDPR-friendly, transparent practices.",
    alternates: { canonical: `${baseUrl}/privacy` },
    openGraph: {
      title: "Privacy Policy | Torq Studio",
      description:
        "How we collect, use, and protect your data. Transparent privacy practices for our website and services.",
      url: `${baseUrl}/privacy`,
    },
    robots: { index: true, follow: true },
  };
}

export default async function PrivacyPage() {
  const siteUrl = await getSiteUrl();
  const breadcrumbLd = breadcrumbListJsonLd(siteUrl, [
    { name: "Home", path: "/" },
    { name: "Privacy", path: "/privacy" },
  ]);
  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={breadcrumbLd} />
      <header className="border-b border-border/50 bg-surface">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-6 sm:px-6">
          <Link
            href="/"
            className="font-display text-lg font-bold text-foreground"
          >
            torq <span className="text-primary">studio</span>
          </Link>
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Home
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="font-display text-3xl font-bold text-foreground">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
        </p>
        <div className="prose prose-invert mt-8 max-w-none">
          <p className="text-muted-foreground leading-relaxed">
            Torq Studio (“we”, “us”) is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your information when you use our website or services.
          </p>
          <h2 className="mt-8 font-display text-lg font-semibold text-foreground">
            Information we collect
          </h2>
          <p className="mt-2 text-muted-foreground leading-relaxed">
            We may collect contact details (e.g. name, email, company) when you get in touch, and usage data (e.g. pages visited) via cookies or similar technologies where applicable.
          </p>
          <h2 className="mt-8 font-display text-lg font-semibold text-foreground">
            Cookies, analytics, and session recordings
          </h2>
          <p className="mt-2 text-muted-foreground leading-relaxed">
            Where we use Google Analytics or Microsoft Clarity, those tools may set cookies or use similar technologies to
            help us understand how the site is used (for example, page views, approximate location, and session replays or
            heatmaps). We ask for your consent via the cookie banner before loading these services. Your choice is stored
            in your browser (for example in localStorage) so we do not have to ask on every visit. You can withdraw consent
            by clearing site data for this domain or using your browser controls. See{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google’s privacy policy
            </a>{" "}
            and{" "}
            <a
              href="https://privacy.microsoft.com/privacystatement"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Microsoft’s privacy statement
            </a>{" "}
            for how those services process data.
          </p>
          <h2 className="mt-8 font-display text-lg font-semibold text-foreground">
            How we use it
          </h2>
          <p className="mt-2 text-muted-foreground leading-relaxed">
            We use your information to respond to enquiries, deliver services, improve our website, and comply with legal obligations. We do not sell your data to third parties.
          </p>
          <h2 className="mt-8 font-display text-lg font-semibold text-foreground">
            Developer utilities on this website
          </h2>
          <p className="mt-2 text-muted-foreground leading-relaxed">
            The utilities at{" "}
            <PrivacyDevToolsLink className="text-primary hover:underline" />{" "}
            (SVG to CSS, JSON to CSV, CSS shadow preview) run in your browser. Your inputs are not sent to our servers
            for those pages.
          </p>
          <h2 className="mt-8 font-display text-lg font-semibold text-foreground">
            Security & your rights
          </h2>
          <p className="mt-2 text-muted-foreground leading-relaxed">
            We take reasonable steps to keep your data secure. Depending on your location, you may have rights to access, correct, or delete your data. Contact us at{" "}
            <a href="mailto:hello@torqstudio.com" className="text-primary hover:underline">
              hello@torqstudio.com
            </a>{" "}
            for any privacy requests.
          </p>
          <p className="mt-8 text-muted-foreground leading-relaxed">
            We may update this policy from time to time. Continued use of our site after changes constitutes acceptance.
          </p>
        </div>
        <Link
          href="/"
          className="mt-10 inline-block text-primary hover:underline"
        >
          ← Back to home
        </Link>
      </main>
    </div>
  );
}

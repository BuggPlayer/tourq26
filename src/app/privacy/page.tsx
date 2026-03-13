import type { Metadata } from "next";
import Link from "next/link";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://torqstudio.com";

export const metadata: Metadata = {
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

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="border-b border-[var(--color-border)]/50 bg-[var(--surface)]">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-6 sm:px-6">
          <Link
            href="/"
            className="font-display text-lg font-bold text-white"
          >
            torq <span className="text-[var(--color-primary)]">studio</span>
          </Link>
          <Link
            href="/"
            className="text-sm text-[var(--color-muted)] hover:text-white"
          >
            ← Home
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="font-display text-3xl font-bold text-white">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Last updated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
        </p>
        <div className="prose prose-invert mt-8 max-w-none">
          <p className="text-[var(--color-muted)] leading-relaxed">
            Torq Studio (“we”, “us”) is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your information when you use our website or services.
          </p>
          <h2 className="mt-8 font-display text-lg font-semibold text-white">
            Information we collect
          </h2>
          <p className="mt-2 text-[var(--color-muted)] leading-relaxed">
            We may collect contact details (e.g. name, email, company) when you get in touch, and usage data (e.g. pages visited) via cookies or similar technologies where applicable.
          </p>
          <h2 className="mt-8 font-display text-lg font-semibold text-white">
            How we use it
          </h2>
          <p className="mt-2 text-[var(--color-muted)] leading-relaxed">
            We use your information to respond to enquiries, deliver services, improve our website, and comply with legal obligations. We do not sell your data to third parties.
          </p>
          <h2 className="mt-8 font-display text-lg font-semibold text-white">
            Security & your rights
          </h2>
          <p className="mt-2 text-[var(--color-muted)] leading-relaxed">
            We take reasonable steps to keep your data secure. Depending on your location, you may have rights to access, correct, or delete your data. Contact us at{" "}
            <a href="mailto:hello@torqstudio.com" className="text-[var(--color-primary)] hover:underline">
              hello@torqstudio.com
            </a>{" "}
            for any privacy requests.
          </p>
          <p className="mt-8 text-[var(--color-muted)] leading-relaxed">
            We may update this policy from time to time. Continued use of our site after changes constitutes acceptance.
          </p>
        </div>
        <Link
          href="/"
          className="mt-10 inline-block text-[var(--color-primary)] hover:underline"
        >
          ← Back to home
        </Link>
      </main>
    </div>
  );
}

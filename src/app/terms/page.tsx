import type { Metadata } from "next";
import Link from "next/link";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://torqstudio.com";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Torq Studio terms of service. Terms governing use of our website and services. Intellectual property and contact.",
  alternates: { canonical: `${baseUrl}/terms` },
  openGraph: {
    title: "Terms of Service | Torq Studio",
    description:
      "Terms governing use of our website and services. Use of website, services, and intellectual property.",
    url: `${baseUrl}/terms`,
  },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
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
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Last updated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
        </p>
        <div className="prose prose-invert mt-8 max-w-none">
          <p className="text-[var(--color-muted)] leading-relaxed">
            By using the Torq Studio website and services, you agree to these terms. If you do not agree, please do not use our site or services.
          </p>
          <h2 className="mt-8 font-display text-lg font-semibold text-white">
            Use of our website
          </h2>
          <p className="mt-2 text-[var(--color-muted)] leading-relaxed">
            You may use our website for lawful purposes only. You must not use it to transmit harmful, offensive, or illegal content or to attempt to gain unauthorised access to our or others’ systems.
          </p>
          <h2 className="mt-8 font-display text-lg font-semibold text-white">
            Services & agreements
          </h2>
          <p className="mt-2 text-[var(--color-muted)] leading-relaxed">
            Specific projects and engagements are governed by separate agreements (e.g. statements of work, contracts). Nothing on this website constitutes a binding commitment until a written agreement is signed.
          </p>
          <h2 className="mt-8 font-display text-lg font-semibold text-white">
            Intellectual property
          </h2>
          <p className="mt-2 text-[var(--color-muted)] leading-relaxed">
            Content on this site (text, design, logos) is owned by Torq Studio or its licensors. You may not copy or use it without our prior written permission. Deliverables under client projects are governed by the relevant project agreement.
          </p>
          <h2 className="mt-8 font-display text-lg font-semibold text-white">
            Contact
          </h2>
          <p className="mt-2 text-[var(--color-muted)] leading-relaxed">
            For questions about these terms, contact us at{" "}
            <a href="mailto:hello@torqstudio.com" className="text-[var(--color-primary)] hover:underline">
              hello@torqstudio.com
            </a>.
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

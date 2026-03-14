import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "./ContactForm";

const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://torqstudio.com").replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Torq Studio for mobile app development, web development, AI solutions, or remote IT resources. Free 30-min consultation. We respond within 24 hours.",
  alternates: { canonical: `${baseUrl}/contact` },
  openGraph: {
    title: "Contact Torq Studio | Get a Free Consultation",
    description:
      "Discuss your project with our team. Mobile apps, web, AI, remote IT—we're here to help you scale smarter.",
    url: `${baseUrl}/contact`,
  },
  robots: { index: true, follow: true },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />
      <main>
        <section className="gradient-mesh relative border-b border-[var(--color-border)]/40 px-4 pt-32 pb-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-[var(--color-primary)]">
              Get in touch
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
              Let’s talk about your project
            </h1>
            <p className="mt-6 text-[var(--color-muted)]">
              Tell us your goals—mobile, web, AI, or remote team. Free 30-min consultation, no commitment.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-xl px-4 py-16 sm:px-6 lg:px-8">
          <ContactForm />
          <div className="mt-12 border-t border-[var(--color-border)]/40 pt-12 text-center">
            <p className="text-sm text-[var(--color-muted)]">
              Prefer email?{" "}
              <a
                href="mailto:hello@torqstudio.com"
                className="font-medium text-[var(--color-primary)] hover:underline"
              >
                hello@torqstudio.com
              </a>
            </p>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              We respond within 24 hours.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import MarketingHeader from "@/components/MarketingHeader";
import { requireMarketingFeature } from "@/lib/require-marketing-feature";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import ContactForm from "./ContactForm";
import { getSiteUrl } from "@/lib/site-url";
import { breadcrumbListJsonLd } from "@/lib/seo";
import { SupportingProseSection } from "@/components/marketing/SupportingProseSection";

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = await getSiteUrl();
  return {
    title: "Contact Us",
    description:
      "Contact Torq Studio: senior software engineers for mobile apps, websites, AI, technical consulting, and remote delivery. Free 30-min consultation.",
    alternates: { canonical: `${baseUrl}/contact` },
    openGraph: {
      title: "Contact Torq Studio | Get a Free Consultation",
      description:
        "Discuss your project with our team. Mobile apps, web, AI, remote IT — we're here to help you scale smarter.",
      url: `${baseUrl}/contact`,
    },
    robots: { index: true, follow: true },
  };
}

export default async function ContactPage() {
  await requireMarketingFeature("marketing_contact_form", "marketing_contact_form");
  const siteUrl = await getSiteUrl();
  const breadcrumbLd = breadcrumbListJsonLd(siteUrl, [
    { name: "Home", path: "/" },
    { name: "Contact", path: "/contact" },
  ]);
  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={breadcrumbLd} />
      <MarketingHeader />
      <main>
        {/* Hero band — dark */}
        <section className="hero-band">
          <div className="relative z-10 mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-10 px-4 pt-32 pb-20 sm:px-6 sm:pt-36 sm:pb-24 lg:grid-cols-12 lg:gap-12 lg:px-8 lg:pt-40 lg:pb-[80px]">
            <div className="lg:col-span-7">
              <p className="mono-eyebrow text-white/55">GET IN TOUCH</p>
              <h1 className="display-xxl mt-5 text-white">
                Tell us what you&apos;re building.
              </h1>
              <p className="mt-6 max-w-2xl text-[17px] leading-[1.5] text-white/70">
                Free 30-min consultation. No commitment. Use the form for structured
                enquiries, or email{" "}
                <a
                  href="mailto:hello@torqstudio.com"
                  className="text-white underline underline-offset-4 decoration-white/40 hover:decoration-white"
                >
                  hello@torqstudio.com
                </a>{" "}
                with attachments and background links.
              </p>
            </div>
            <ul className="flex flex-col gap-4 text-[14px] text-white/70 lg:col-span-5 lg:items-end">
              <li className="flex items-baseline gap-3">
                <span className="mono-label text-white/45">RESPONSE</span>
                <span className="text-white">Within 24 hours</span>
              </li>
              <li className="flex items-baseline gap-3">
                <span className="mono-label text-white/45">OVERLAP</span>
                <span className="text-white">India · MENA · EU</span>
              </li>
              <li className="flex items-baseline gap-3">
                <span className="mono-label text-white/45">NDA</span>
                <span className="text-white">Standard or yours — happy to sign</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Form + context */}
        <section className="band-light border-t border-hairline">
          <div className="mx-auto w-full max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-[80px]">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
              <aside className="lg:col-span-5">
                <p className="mono-eyebrow text-muted-foreground">WHAT TO INCLUDE</p>
                <h2 className="display-lg mt-4 text-foreground">
                  A short, useful first message.
                </h2>
                <ul className="mt-6 space-y-4 text-[15px] leading-[1.55] text-muted-foreground">
                  {[
                    "Current stage — idea, MVP, scale.",
                    "Tech stack or known constraints.",
                    "Target users, regions, or governance rules.",
                    "Budget band (if you know it) and a rough timeline.",
                    "Whether you need full delivery, staff aug, or advice only.",
                  ].map((line) => (
                    <li key={line} className="flex items-start gap-3">
                      <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-foreground" aria-hidden />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-10 card-flat">
                  <p className="mono-eyebrow text-muted-foreground">FREE CONSULTATION</p>
                  <p className="mt-3 text-[16px] leading-[1.5] text-foreground">
                    Share goals, constraints, and timeline — we&apos;ll suggest a sensible
                    next step.
                  </p>
                  <Link href="/services" className="btn-base btn-outline mt-5">
                    View service catalogue
                  </Link>
                </div>
              </aside>

              <div className="lg:col-span-7">
                <ContactForm />
                <p className="mt-10 border-t border-hairline pt-6 text-[14px] text-muted-foreground">
                  Prefer email?{" "}
                  <a
                    href="mailto:hello@torqstudio.com"
                    className="text-foreground underline underline-offset-4 decoration-[var(--app-hairline)] hover:decoration-[var(--app-fg)]"
                  >
                    hello@torqstudio.com
                  </a>{" "}
                  · We respond within 24 hours.
                </p>
              </div>
            </div>
          </div>
        </section>

        <SupportingProseSection
          id="contact-next-steps"
          eyebrow="WHAT HAPPENS NEXT"
          heading="A working session, not a sales script."
          paragraphs={[
            "Share a short note about your product, stack, and timeline. We read every message and reply with a concrete next step — a discovery call, a written scope review, or a polite redirect if we are not the right fit.",
            "Typical engagements include mobile apps (iOS and Android), web platforms and APIs, practical AI automation, and remote engineering squads. We also take on advisory work: architecture reviews, vendor diligence, rescue assessments, and estimation sanity checks before you commit budget.",
            "Helpful context in your first message includes: current stage, tech stack or constraints, target users or regions, budget band if you know it, and whether you need full delivery, staff augmentation, or advice only. You do not need a perfect brief — we will ask clarifying questions.",
          ]}
        />

        <SupportingProseSection
          id="contact-locations-models"
          eyebrow="ENGAGEMENT MODELS"
          heading="Fixed-price, retainers, embedded squads, or paid discovery."
          paragraphs={[
            "Fixed-price or milestone work suits bounded scope with clear acceptance criteria. Retainers and embedded squads fit ongoing roadmaps, incident support, and continuous delivery. Discovery engagements are short, paid blocks when you need a written assessment, risk register, or vendor comparison before funding a larger build.",
            "We document decisions in writing, use your issue tracker and repositories when appropriate, and align on security expectations (access, secrets, data residency) from day one. For regulated industries we respect your vendor questionnaires, NDAs, and procurement steps.",
            "Torq Studio is based in Mumbai; we routinely overlap with teams in India, the Gulf, and Western Europe. If you are unsure whether remote collaboration fits your governance rules, mention it in the form and we will outline how we have handled similar clients.",
          ]}
        />
      </main>
      <Footer />
    </div>
  );
}

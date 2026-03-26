import type { Metadata } from "next";
import Image from "next/image";
import MarketingHeader from "@/components/MarketingHeader";
import { requireMarketingFeature } from "@/lib/require-marketing-feature";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import ContactForm from "./ContactForm";
import { getSiteUrl } from "@/lib/site-url";
import { breadcrumbListJsonLd } from "@/lib/seo";
import { sitePhotos } from "@/data/site-photos";

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
        "Discuss your project with our team. Mobile apps, web, AI, remote IT—we're here to help you scale smarter.",
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
        <section className="gradient-mesh relative border-b border-border/40 px-4 pt-32 pb-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-primary">
              Get in touch
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl">
              Let’s talk about your project
            </h1>
            <p className="mt-6 text-muted-foreground">
              Tell us your goals—mobile, web, AI, or remote team. Free 30-min consultation, no commitment.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="relative mb-10 overflow-hidden rounded-2xl border border-border/50 lg:hidden">
            <div className="relative aspect-[21/9] min-h-[140px]">
              <Image
                src={sitePhotos.contactAside.src}
                alt={sitePhotos.contactAside.alt}
                fill
                className="object-cover object-center"
                sizes="100vw"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background/70 to-transparent" aria-hidden />
            </div>
          </div>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 lg:items-start">
            <div className="lg:col-span-5">
              <div className="sticky top-28 hidden overflow-hidden rounded-2xl border border-border/50 bg-surface shadow-xl ring-1 ring-foreground/5 lg:block">
                <div className="relative aspect-[3/4]">
                  <Image
                    src={sitePhotos.contactAside.src}
                    alt={sitePhotos.contactAside.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 0px, 40vw"
                  />
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent"
                    aria-hidden
                  />
                </div>
                <div className="border-t border-border/40 p-6">
                  <p className="text-sm font-medium text-foreground">Free 30-min consultation</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Share goals, constraints, and timeline—we’ll suggest a sensible next step.
                  </p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-7">
              <ContactForm />
              <div className="mt-12 border-t border-border/40 pt-12 text-center lg:text-left">
                <p className="text-sm text-muted-foreground">
                  Prefer email?{" "}
                  <a
                    href="mailto:hello@torqstudio.com"
                    className="font-medium text-primary hover:underline"
                  >
                    hello@torqstudio.com
                  </a>
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  We respond within 24 hours.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

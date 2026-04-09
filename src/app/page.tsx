import type { Metadata } from "next";
import MarketingHeader from "@/components/MarketingHeader";
import Hero from "@/components/Hero";
import WorkGalleryStrip from "@/components/WorkGalleryStrip";
import TrustBar from "@/components/TrustBar";
import Services from "@/components/Services";
import WhyChooseUs from "@/components/WhyChooseUs";
import CaseStudies from "@/components/CaseStudies";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import HomePageContent from "@/components/HomePageContent";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { readTestimonials, readSiteContent } from "@/lib/content";
import { webPageJsonLd } from "@/lib/seo";
import { SupportingProseSection } from "@/components/marketing/SupportingProseSection";

export async function generateMetadata(): Promise<Metadata> {
  const site = await readSiteContent();
  const siteUrl = site.siteUrl.replace(/\/$/, "");
  return {
    alternates: { canonical: siteUrl },
    openGraph: { url: siteUrl },
  };
}

export default async function Home() {
  const [testimonials, site] = await Promise.all([readTestimonials(), readSiteContent()]);
  const siteUrl = site.siteUrl.replace(/\/$/, "");
  const servicesLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Services",
    numberOfItems: 5,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Mobile Apps", url: `${siteUrl}/services/mobile-app-development` },
      { "@type": "ListItem", position: 2, name: "Web & APIs", url: `${siteUrl}/services/web-development` },
      { "@type": "ListItem", position: 3, name: "AI Solutions", url: `${siteUrl}/services/ai-solutions` },
      { "@type": "ListItem", position: 4, name: "Remote IT", url: `${siteUrl}/services/remote-it` },
      { "@type": "ListItem", position: 5, name: "Technical consulting", url: `${siteUrl}/services/technical-consulting` },
    ],
  };
  const webPageLd = webPageJsonLd({
    siteUrl,
    path: "/",
    name: site.defaultTitle,
    description: site.defaultDescription,
  });

  return (
    <>
      <JsonLd data={webPageLd} />
      <JsonLd data={servicesLd} />
      <MarketingHeader />
      <main>
        <Hero />
        <WorkGalleryStrip />
        <TrustBar />
        <Services />
        <WhyChooseUs />
        <CaseStudies />
        <Testimonials items={testimonials} />
        <HomePageContent />
        <SupportingProseSection
          id="home-snapshot"
          heading="Snapshot for technical decision-makers"
          paragraphs={[
            "Torq Studio is a senior-engineering-led practice: we build and advise on mobile applications, customer-facing websites, internal web platforms, public and partner APIs, and practical AI automation where there is a measurable workflow to improve.",
            "Clients choose us when delivery risk is high—store review, traffic spikes, integration breakage, or governance—and they want direct access to the people doing the work. We document scope, acceptance criteria, and milestone checkpoints so finance and leadership see steady progress, not black-box development.",
            "Engagement models span fixed-scope MVPs, ongoing retainers, embedded squads, and paid discovery or architecture reviews when you need confidence before funding a larger build. Explore services for discipline-specific detail, case studies for comparable contexts, or contact us for a free 30-minute consultation.",
          ]}
        />
        <CTA />
        <Footer />
      </main>
    </>
  );
}

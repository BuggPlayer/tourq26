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
        <CTA />
        <Footer />
      </main>
    </>
  );
}

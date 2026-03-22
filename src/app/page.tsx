import type { Metadata } from "next";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import Services from "@/components/Services";
import WhyChooseUs from "@/components/WhyChooseUs";
import CaseStudies from "@/components/CaseStudies";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { readTestimonials, readSiteContent } from "@/lib/content";
import { servicesItemListJsonLd, webPageJsonLd } from "@/lib/seo";

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
  const servicesLd = servicesItemListJsonLd(siteUrl, [
    { name: "Mobile Apps", description: "Native and cross-platform mobile development." },
    { name: "Web & APIs", description: "Scalable web applications and APIs." },
    { name: "AI Solutions", description: "Automation, chatbots, and data-driven features." },
    { name: "Remote IT", description: "Dedicated developers and integrated teams." },
  ]);
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
      <Header />
      <main>
        <Hero />
        <TrustBar />
        <Services />
        <WhyChooseUs />
        <CaseStudies />
        <Testimonials items={testimonials} />
        <CTA />
        <Footer />
      </main>
    </>
  );
}

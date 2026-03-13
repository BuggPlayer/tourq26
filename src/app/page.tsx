import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import Services from "@/components/Services";
import WhyChooseUs from "@/components/WhyChooseUs";
import CaseStudies from "@/components/CaseStudies";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import { readTestimonials } from "@/lib/content";

export default async function Home() {
  const testimonials = await readTestimonials();
  return (
    <>
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

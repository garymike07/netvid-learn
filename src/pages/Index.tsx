import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import VideoShowcase from "@/components/VideoShowcase";
import Curriculum from "@/components/Curriculum";
import BrandGround from "@/components/BrandGround";
import Pricing from "@/components/Pricing";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import SiteGuide from "@/components/SiteGuide";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <Features />
      <VideoShowcase />
      <Curriculum />
      <BrandGround />
      <Pricing />
      <CTA />
      <Footer />
      <SiteGuide context="index" />
    </main>
  );
};

export default Index;

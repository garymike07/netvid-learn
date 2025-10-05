import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import VideoShowcase from "@/components/VideoShowcase";
import Curriculum from "@/components/Curriculum";
import Pricing from "@/components/Pricing";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <Features />
      <VideoShowcase />
      <Curriculum />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  );
};

export default Index;

import { useMemo } from "react";
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
import SocialProof from "@/components/marketing/SocialProof";
import TrackHighlights from "@/components/marketing/TrackHighlights";
import MarketingEvents from "@/components/marketing/MarketingEvents";
import CertificationSpotlight from "@/components/marketing/CertificationSpotlight";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TWITTER, SITE_URL } from "@/config/site";
import { useDocumentMetadata } from "@/hooks/use-document-metadata";

const Index = () => {
  const metadata = useMemo(
    () => ({
      title: `${SITE_NAME} | Network Automation & Telco Engineering Academy`,
      description: SITE_DESCRIPTION,
      canonical: SITE_URL,
      openGraph: {
        title: `${SITE_NAME} – Build world-class networking skills`,
        description: SITE_DESCRIPTION,
        type: "website",
        url: SITE_URL,
        image: `${SITE_URL}/images/mike-net-logo.png`,
      },
      twitter: {
        title: `${SITE_NAME} – Build world-class networking skills`,
        description: SITE_DESCRIPTION,
        image: `${SITE_URL}/images/mike-net-logo.png`,
        card: "summary_large_image",
      },
      structuredData: [
        {
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          name: SITE_NAME,
          url: SITE_URL,
          logo: `${SITE_URL}/images/mike-net-logo.png`,
          sameAs: [`https://twitter.com/${SITE_TWITTER.replace(/^@/, "")}`],
          description: SITE_DESCRIPTION,
        },
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          url: SITE_URL,
          name: SITE_NAME,
          potentialAction: {
            "@type": "SearchAction",
            target: `${SITE_URL}/courses?query={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        },
      ],
    }),
    []);

  useDocumentMetadata(metadata);

  return (
    <main id="main-content" className="min-h-screen" role="main">
      <Navigation />
      <Hero />
      <TrackHighlights />
      <SocialProof />
      <Features />
      <VideoShowcase />
      <MarketingEvents />
      <Curriculum />
      <BrandGround />
      <CertificationSpotlight />
      <Pricing />
      <CTA />
      <Footer />
      <SiteGuide context="index" />
    </main>
  );
};

export default Index;

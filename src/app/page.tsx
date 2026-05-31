import type { Metadata } from "next";
import { HeroSection } from "@/components/home/hero-section";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};
import { LumiIntroSection } from "@/components/home/lumi-intro-section";
import { FeaturesSection } from "@/components/home/features-section";
import { CollectionSection } from "@/components/home/collection-section";
import { ForTheCollectorSection } from "@/components/home/for-the-collector-section";
import { PricingTeaserSection } from "@/components/home/pricing-teaser-section";
import { FinalCtaSection } from "@/components/home/final-cta-section";

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Olfaire",
            applicationCategory: "LifestyleApplication",
            operatingSystem: "iOS, Android",
            description:
              "AI-powered daily fragrance picks, layering chemistry, and Fragrance DNA — guided by Lumi.",
            url: "https://olfaire.app",
            offers: [
              { "@type": "Offer", price: "0", priceCurrency: "USD", name: "Free" },
              { "@type": "Offer", price: "4.99", priceCurrency: "USD", name: "Premium Monthly" },
              { "@type": "Offer", price: "39.99", priceCurrency: "USD", name: "Premium Annual" },
              { "@type": "Offer", price: "99.99", priceCurrency: "USD", name: "Lifetime" },
            ],
          }),
        }}
      />
      <HeroSection />
      <LumiIntroSection />
      <FeaturesSection />
      <CollectionSection />
      <ForTheCollectorSection />
      <PricingTeaserSection />
      <FinalCtaSection />
    </>
  );
}

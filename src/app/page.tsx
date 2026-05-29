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

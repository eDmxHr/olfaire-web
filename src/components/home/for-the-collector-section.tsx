import { Eyebrow } from "@/components/ui/eyebrow";
import { FeatureItem } from "@/components/ui/feature-item";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { Heading } from "@/components/ui/heading";
import { PhoneParallax } from "@/components/home/phone-parallax";
import { FadeUp, StaggerChildren, StaggerItem } from "@/components/ui/animate";
import { personas } from "@/data/home";

export function ForTheCollectorSection() {
  return (
    <SectionWrapper className="bg-linen" maxWidth="lg">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <FadeUp>
          <Eyebrow className="mb-6">Who it&#39;s for</Eyebrow>
          <Heading as="h2" size="section" className="mb-8">
            Built for people who take fragrance seriously.
          </Heading>
          <StaggerChildren className="space-y-6" stagger={0.1} delay={0.2}>
            {personas.map((persona) => (
              <StaggerItem key={persona.title}>
                <FeatureItem title={persona.title}>
                  {persona.description}
                </FeatureItem>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </FadeUp>

        <PhoneParallax />
      </div>
    </SectionWrapper>
  );
}

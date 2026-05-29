import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { Heading } from "@/components/ui/heading";
import { FadeUp } from "@/components/ui/animate";

export function PricingTeaserSection() {
  return (
    <SectionWrapper className="border-t border-dust" maxWidth="md" innerClassName="text-center">
      <FadeUp>
        <Eyebrow className="mb-6">Pricing</Eyebrow>
        <Heading as="h2" size="section" className="mb-6">
          Free to start. Premium when you're ready.
        </Heading>
        <p className="text-ash text-base leading-relaxed mb-8">
          The free tier is genuinely useful — daily suggestions, basic
          layering, your first signature. Upgrade when your collection
          outgrows it.
        </p>
      </FadeUp>
      <FadeUp delay={0.15} className="flex flex-col sm:flex-row gap-4 justify-center">
        <a
          href="#hero"
          className="bg-ink text-parchment px-8 py-4 rounded-full text-sm font-medium tracking-wide hover:bg-amber transition-colors duration-200"
        >
          Join the waitlist
        </a>
        <a
          href="/pricing"
          className="border border-dust text-ink px-8 py-4 rounded-full text-sm font-medium tracking-wide hover:border-ink transition-colors duration-200"
        >
          See pricing →
        </a>
      </FadeUp>
    </SectionWrapper>
  );
}

import { LumiMark } from "@/components/lumi-mark";
import { WaitlistForm } from "@/components/waitlist-form";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { Heading } from "@/components/ui/heading";
import { colors } from "@/lib/colors";
import { FadeUp } from "@/components/ui/animate";

export function FinalCtaSection() {
  return (
    <SectionWrapper
      id="waitlist"
      className="bg-ink text-parchment scroll-mt-16"
      maxWidth="md"
      innerClassName="text-center"
    >
      <FadeUp duration={0.8}>
        <LumiMark
          size={48}
          wingColor={colors.parchment}
          className="mx-auto mb-8"
        />
        <Heading as="h2" size="section" className="text-parchment mb-4">
          Be first to meet Lumi.
        </Heading>
        <p className="serif text-lg font-light italic text-parchment/60 mb-10">
          "Something refined is being built. Early access comes with early
          pricing."
        </p>
      </FadeUp>
      <FadeUp delay={0.2}>
        <WaitlistForm />
      </FadeUp>
    </SectionWrapper>
  );
}

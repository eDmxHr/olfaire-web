import { Eyebrow } from "@/components/ui/eyebrow";
import { CountUp } from "@/components/count-up";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { Heading } from "@/components/ui/heading";
import { FadeUp, StaggerChildren, StaggerItem } from "@/components/ui/animate";
import { collectionStats } from "@/data/home";

export function CollectionSection() {
  return (
    <SectionWrapper className="border-t border-dust" maxWidth="lg" innerClassName="text-center">
      <FadeUp>
        <Eyebrow className="mb-6">Your collection</Eyebrow>
        <Heading as="h2" size="section" className="mb-8">
          Every bottle you own,{" "}
          <span className="italic">intelligently organised.</span>
        </Heading>
        <p className="text-ash text-lg leading-relaxed max-w-2xl mx-auto mb-16">
          Add your bottles in seconds with automatic fragrance data — full notes
          pyramid, concentration, longevity, sillage. Track what you wear, rate
          what you love, never lose track of what's running low.
        </p>
      </FadeUp>

      <StaggerChildren className="grid grid-cols-3 gap-8 max-w-lg mx-auto" stagger={0.1}>
        {collectionStats.map(({ number, label }) => (
          <StaggerItem key={label}>
            <div className="flex flex-col gap-4 text-center">
              <CountUp value={number} className="serif text-4xl font-light text-ink mb-1" />
              <p className="text-ash text-sm tracking-wide">{label}</p>
            </div>
          </StaggerItem>
        ))}
      </StaggerChildren>
    </SectionWrapper>
  );
}

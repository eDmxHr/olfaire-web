import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { Heading } from "@/components/ui/heading";
import { FadeUp, StaggerChildren, StaggerItem } from "@/components/ui/animate";
import { lumiQuotes } from "@/data/home";

export function LumiIntroSection() {
  return (
    <SectionWrapper className="bg-ink text-parchment" maxWidth="lg">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <FadeUp>
          <Eyebrow variant="dark" className="mb-6">
            Meet Lumi
          </Eyebrow>
          <Heading as="h2" size="section" className="text-parchment mb-8">
            A fragrance guide who speaks like she knows what she's talking
            about.
          </Heading>
          <div className="space-y-4 text-parchment/60 leading-relaxed">
            <p>
              Lumi is Olfaire's AI intelligence. Not a chatbot. Not a
              recommendation engine. A guide who understands note chemistry,
              skin type, weather, and the difference between what you own and
              what actually fits the moment.
            </p>
            <p>
              She speaks in precise, literary sentences. She never says "Great
              choice!" She never recommends something you don't own. She knows
              that a $30 bottle deserves the same analytical depth as a $300
              one.
            </p>
          </div>
        </FadeUp>

        <StaggerChildren className="space-y-4" stagger={0.12} delay={0.1}>
          {lumiQuotes.map((text, i) => (
            <StaggerItem key={i} y={12}>
              <div className="bg-parchment/8 border border-parchment/10 rounded-2xl rounded-tl-sm px-5 py-4">
                <p className="serif text-lg font-light italic text-parchment leading-relaxed">
                  {text}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </SectionWrapper>
  );
}

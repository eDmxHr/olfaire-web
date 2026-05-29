import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { Heading } from "@/components/ui/heading";
import { FadeUp, StaggerChildren, StaggerItem } from "@/components/ui/animate";
import { amberAlpha } from "@/lib/colors";
import { features } from "@/data/home";

export function FeaturesSection() {
  return (
    <SectionWrapper>
      <FadeUp className="text-center mb-20">
        <Eyebrow className="mb-4">What Olfaire does</Eyebrow>
        <Heading as="h2" size="section">
          Three things, done right.
        </Heading>
      </FadeUp>

      <StaggerChildren className="grid md:grid-cols-3 gap-8" stagger={0.1}>
        {features.map((feature) => (
          <StaggerItem key={feature.title}>
            {feature.variant === "dark" ? (
              <div className="group bg-ink rounded-2xl p-8 relative overflow-hidden cursor-pointer transition-transform duration-300 ease-out hover:-translate-y-2">
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    background: `radial-gradient(ellipse at 80% 20%, ${amberAlpha(0.4)} 0%, transparent 60%)`,
                  }}
                />
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-full bg-parchment/10 flex items-center justify-center mb-6">
                    <span className="text-amber text-lg">{feature.icon}</span>
                  </div>
                  <Heading as="h3" size="card" className="text-parchment mb-4 transition-colors duration-300 group-hover:text-amber">
                    {feature.title}
                  </Heading>
                  <p className="text-parchment/60 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ) : (
              <div className="group bg-linen rounded-2xl p-8 cursor-pointer transition-transform duration-300 ease-out hover:-translate-y-2">
                <div className="w-10 h-10 rounded-full bg-ink flex items-center justify-center mb-6">
                  <span className="text-amber text-lg">{feature.icon}</span>
                </div>
                <Heading as="h3" size="card" className="mb-4 transition-colors duration-300 group-hover:text-amber">
                  {feature.title}
                </Heading>
                <p className="text-ash text-sm leading-relaxed">{feature.description}</p>
              </div>
            )}
          </StaggerItem>
        ))}
      </StaggerChildren>
    </SectionWrapper>
  );
}

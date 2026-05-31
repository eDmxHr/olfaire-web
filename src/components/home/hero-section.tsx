import { WaitlistForm } from "@/components/waitlist-form";
import { Eyebrow } from "@/components/ui/eyebrow";
import { amberAlpha } from "@/lib/colors";
import { HeroMotion } from "@/components/home/hero-motion";
import { PhoneParallax } from "@/components/home/phone-parallax";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 px-6 pt-24 pb-16 relative max-w-7xl mx-auto w-full"
    >
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 75% 45%, ${amberAlpha(0.12)} 0%, transparent 70%)`,
        }}
      />

      {/* Left: text + form */}
      <div className="relative z-10 lg:w-[42%] text-center lg:text-left">
        <HeroMotion>
          <Eyebrow className="mb-6 lg:justify-start">
            Introducing Olfaire
          </Eyebrow>

          <h1 className="serif text-5xl md:text-7xl font-light leading-[1.1] tracking-[0.02em] text-ink mb-6">
            Your <span className="text-amber">perfume</span> collection,{" "}
            <span className="italic">
              finally <span className="text-amber">intelligent.</span>
            </span>
          </h1>

          <p className="text-ash text-lg md:text-xl leading-relaxed max-w-xl mb-12 mx-auto lg:mx-0">
            Daily picks based on your mood. Layering chemistry that actually
            explains the science. A fragrance guide who speaks like she knows
            what she&apos;s talking about.
          </p>

          <div id="waitlist" className="max-w-md scroll-mt-20 mx-auto lg:mx-0">
            <WaitlistForm />
          </div>
        </HeroMotion>
      </div>

      {/* Right: phone frames */}
      <div className="flex-shrink-0 w-full lg:flex-1 relative z-10 lg:overflow-hidden">
        <PhoneParallax />
      </div>
    </section>
  );
}

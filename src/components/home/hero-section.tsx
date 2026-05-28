import { LumiMark } from "@/components/lumi-mark";
import { WaitlistForm } from "@/components/waitlist-form";
import { Eyebrow } from "@/components/ui/eyebrow";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 relative overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(176,125,42,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <div className="flex justify-center mb-8 animate-float">
          <LumiMark size={72} wingColor="#1C1A18" bodyColor="#B07D2A" />
        </div>

        <Eyebrow className="mb-6">Introducing Olfaire</Eyebrow>

        <h1 className="serif text-5xl md:text-7xl font-light leading-[1.1] tracking-[0.02em] text-ink mb-6">
          Your <span className="text-amber">perfume</span> collection,{" "}
          <span className="italic">
            finally <span className="text-amber">intelligent.</span>
          </span>
        </h1>

        <p className="text-ash text-lg md:text-xl leading-relaxed max-w-xl mx-auto mb-12">
          Daily picks based on your mood. Layering chemistry that actually
          explains the science. A fragrance guide who speaks like she knows what
          she's talking about.
        </p>

        <div id="waitlist" className="max-w-md mx-auto scroll-mt-20">
          <WaitlistForm />
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <Eyebrow variant="ash">Scroll</Eyebrow>
        <div className="w-px h-8 bg-dust" />
      </div>
    </section>
  );
}

import { Eyebrow } from "@/components/ui/eyebrow";

export function FeaturesSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <Eyebrow className="mb-4">What Olfaire does</Eyebrow>
          <h2 className="serif text-4xl md:text-5xl font-light text-ink tracking-[0.02em] leading-[1.1]">
            Three things, done right.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="group bg-linen rounded-2xl p-8 cursor-pointer transition-transform duration-300 ease-out hover:-translate-y-2">
            <div className="w-10 h-10 rounded-full bg-ink flex items-center justify-center mb-6">
              <span className="text-amber text-lg">✦</span>
            </div>
            <h3 className="serif text-2xl font-light text-ink mb-4 transition-colors duration-300 group-hover:text-amber">
              Your daily pick
            </h3>
            <p className="text-ash text-sm leading-relaxed">
              Every morning, Lumi asks how you're feeling. Five moods. One
              answer. She picks the right bottle from your shelf and tells you
              exactly why — in a sentence worth reading.
            </p>
          </div>

          <div className="group bg-ink rounded-2xl p-8 relative overflow-hidden cursor-pointer transition-transform duration-300 ease-out hover:-translate-y-2">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                background:
                  "radial-gradient(ellipse at 80% 20%, rgba(176,125,42,0.4) 0%, transparent 60%)",
              }}
            />
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-full bg-parchment/10 flex items-center justify-center mb-6">
                <span className="text-amber text-lg">◈</span>
              </div>
              <h3 className="serif text-2xl font-light text-parchment mb-4 transition-colors duration-300 group-hover:text-amber">
                Layering chemistry
              </h3>
              <p className="text-parchment/60 text-sm leading-relaxed">
                Pick two bottles. Lumi analyses the actual note chemistry —
                which notes anchor, amplify, contrast, or clash. Application
                order, body placement, ratios. The science behind why it works.
              </p>
            </div>
          </div>

          <div className="group bg-linen rounded-2xl p-8 cursor-pointer transition-transform duration-300 ease-out hover:-translate-y-2">
            <div className="w-10 h-10 rounded-full bg-ink flex items-center justify-center mb-6">
              <span className="text-amber text-lg">◎</span>
            </div>
            <h3 className="serif text-2xl font-light text-ink mb-4 transition-colors duration-300 group-hover:text-amber">
              Your signatures
            </h3>
            <p className="text-ash text-sm leading-relaxed">
              When you find a combination that works, name it. Save it. Share a
              beautifully designed card. Your combinations, given names worth
              owning.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

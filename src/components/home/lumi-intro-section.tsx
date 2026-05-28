import { LumiMark } from "@/components/lumi-mark";
import { Eyebrow } from "@/components/ui/eyebrow";

export function LumiIntroSection() {
  return (
    <section className="py-24 px-6 bg-ink text-parchment">
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <Eyebrow variant="dark" className="mb-6">
              Meet Lumi
            </Eyebrow>
            <h2 className="serif text-4xl md:text-5xl font-light leading-[1.1] tracking-[0.02em] mb-8">
              A fragrance guide who speaks like she knows what she's talking
              about.
            </h2>
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
          </div>

          <div className="space-y-4">
            <div className="relative">
              <LumiMark
                size={24}
                wingColor="#FAF9F6"
                bodyColor="#B07D2A"
                className="rotate-[140deg] absolute -top-5 -left-5 z-10"
              />
              <div className="bg-parchment/8 border border-parchment/10 rounded-2xl rounded-tl-sm px-5 py-4">
                <p className="serif text-lg font-light italic text-parchment leading-relaxed">
                  "Rain is coming. Vetiver knows how to stay."
                </p>
              </div>
            </div>
            {[
              {
                text: "\"The vetiver in Encre Noire gives Chloé's rose a shadow it doesn't have alone.\"",
                delay: "100ms",
              },
              {
                text: '"Thursday is yours. Wear something that knows how to stay."',
                delay: "200ms",
              },
            ].map(({ text, delay }, i) => (
              <div
                key={i}
                className="bg-parchment/8 border border-parchment/10 rounded-2xl rounded-tl-sm px-5 py-4"
                style={{ animationDelay: delay }}
              >
                <p className="serif text-lg font-light italic text-parchment leading-relaxed">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

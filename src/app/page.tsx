import { LumiMark } from "@/components/lumi-mark";
import { WaitlistForm } from "@/components/waitlist-form";
import { Eyebrow } from "@/components/ui/eyebrow";
import { FeatureItem } from "@/components/ui/feature-item";

export default function HomePage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section
        id="hero"
        className="min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 relative overflow-hidden"
      >
        {/* Subtle background texture */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(176,125,42,0.08) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          {/* Lumi mark */}
          <div className="flex justify-center mb-8 animate-float">
            <LumiMark size={72} wingColor="#1C1A18" bodyColor="#B07D2A" />
          </div>

          {/* Eyebrow */}
          <Eyebrow className="mb-6">Introducing Olfaire</Eyebrow>

          {/* Headline */}
          <h1 className="serif text-5xl md:text-7xl font-light leading-[1.1] tracking-[0.02em] text-ink mb-6">
            Your perfume collection,{" "}
            <span className="italic">finally intelligent.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-ash text-lg md:text-xl leading-relaxed max-w-xl mx-auto mb-12">
            Daily picks based on your mood. Layering chemistry that actually
            explains the science. A fragrance guide who speaks like she knows
            what she's talking about.
          </p>

          {/* Waitlist */}
          <div id="waitlist" className="max-w-md mx-auto scroll-mt-20">
            <WaitlistForm />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <Eyebrow variant="ash">Scroll</Eyebrow>
          <div className="w-px h-8 bg-dust" />
        </div>
      </section>

      {/* ── Lumi introduction ────────────────────────────────────── */}
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
                  skin type, weather, and the difference between what you own
                  and what actually fits the moment.
                </p>
                <p>
                  She speaks in precise, literary sentences. She never says
                  "Great choice!" She never recommends something you don't own.
                  She knows that a $30 bottle deserves the same analytical depth
                  as a $300 one.
                </p>
              </div>
            </div>

            {/* Lumi chat bubbles */}
            <div className="space-y-4">
              {[
                {
                  text: '"Rain is coming. Vetiver knows how to stay."',
                  delay: "0ms",
                },
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
              <div className="flex items-center gap-2 pl-2">
                <LumiMark size={20} wingColor="#FAF9F6" bodyColor="#B07D2A" />
                <Eyebrow variant="dark">Lumi</Eyebrow>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <Eyebrow className="mb-4">What Olfaire does</Eyebrow>
            <h2 className="serif text-4xl md:text-5xl font-light text-ink tracking-[0.02em] leading-[1.1]">
              Three things, done right.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-linen rounded-2xl p-8">
              <div className="w-10 h-10 rounded-full bg-ink flex items-center justify-center mb-6">
                <span className="text-amber text-lg">✦</span>
              </div>
              <h3 className="serif text-2xl font-light text-ink mb-4">
                Your daily pick
              </h3>
              <p className="text-ash text-sm leading-relaxed">
                Every morning, Lumi asks how you're feeling. Five moods. One
                answer. She picks the right bottle from your shelf and tells you
                exactly why — in a sentence worth reading.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-ink rounded-2xl p-8 relative overflow-hidden">
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
                <h3 className="serif text-2xl font-light text-parchment mb-4">
                  Layering chemistry
                </h3>
                <p className="text-parchment/60 text-sm leading-relaxed">
                  Pick two bottles. Lumi analyses the actual note chemistry —
                  which notes anchor, amplify, contrast, or clash. Application
                  order, body placement, ratios. The science behind why it
                  works.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-linen rounded-2xl p-8">
              <div className="w-10 h-10 rounded-full bg-ink flex items-center justify-center mb-6">
                <span className="text-amber text-lg">◎</span>
              </div>
              <h3 className="serif text-2xl font-light text-ink mb-4">
                Your signatures
              </h3>
              <p className="text-ash text-sm leading-relaxed">
                When you find a combination that works, name it. Save it. Share
                a beautifully designed card. Your combinations, given names
                worth owning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Collection manager ───────────────────────────────────── */}
      <section className="py-24 px-6 border-t border-dust">
        <div className="max-w-4xl mx-auto text-center">
          <Eyebrow className="mb-6">Your collection</Eyebrow>
          <h2 className="serif text-4xl md:text-5xl font-light text-ink mb-8 leading-[1.1] tracking-[0.02em]">
            Every bottle you own,{" "}
            <span className="italic">intelligently organised.</span>
          </h2>
          <p className="text-ash text-lg leading-relaxed max-w-2xl mx-auto mb-16">
            Add your bottles in seconds with automatic fragrance data — full
            notes pyramid, concentration, longevity, sillage. Track what you
            wear, rate what you love, never lose track of what's running low.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
            {[
              { number: "1,176+", label: "Fragrances in database" },
              { number: "30", label: "Fragrance families" },
              { number: "5", label: "Mood categories" },
            ].map(({ number, label }) => (
              <div key={label} className="text-center">
                <p className="serif text-4xl font-light text-ink mb-1">
                  {number}
                </p>
                <Eyebrow variant="ash">{label}</Eyebrow>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── For the collector ────────────────────────────────────── */}
      <section className="py-24 px-6 bg-linen">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <Eyebrow className="mb-6">Who it&#39;s for</Eyebrow>
              <h2 className="serif text-4xl md:text-5xl font-light text-ink leading-[1.1] tracking-[0.02em] mb-8">
                Built for people who take fragrance seriously.
              </h2>
              <div className="space-y-6">
                <FeatureItem title="The Collector">
                  Owns 15–60 bottles. Reads Fragrantica. Frustrated that half
                  her shelf never gets worn. Wants a rotation that feels
                  intentional.
                </FeatureItem>
                <FeatureItem title="The Explorer">
                  Growing collection. Wants to understand layering but
                  doesn&apos;t know where to start. Craves a trusted guide.
                </FeatureItem>
                <FeatureItem title="The Social One">
                  Trend-aware. Follows fragrance creators. Loves sharing her
                  rotation. Drives organic growth through shareable signature
                  cards.
                </FeatureItem>
              </div>
            </div>

            {/* Phone mockframe */}
            <div className="flex justify-center">
              <div className="phone-mockframe w-[220px]">
                <div className="phone-screen bg-ink flex flex-col p-5">
                  {/* Mock daily pick screen */}
                  <div className="mt-8">
                    <p className="text-parchment/40 text-[8px] tracking-[0.2em] uppercase mb-1">
                      Today · Soft
                    </p>
                    <p className="serif text-parchment text-xl font-light italic leading-snug mb-4">
                      "Rain is coming. Vetiver knows how to stay."
                    </p>
                    <div className="bg-parchment/8 rounded-xl p-4">
                      <p className="text-parchment/40 text-[8px] tracking-[0.16em] uppercase mb-1">
                        Suggested
                      </p>
                      <p className="text-parchment text-sm font-light">
                        Encre Noire
                      </p>
                      <p className="text-parchment/50 text-[10px]">
                        Lalique · EDT
                      </p>
                      <div className="flex gap-1 mt-3">
                        {["Vetiver", "Woody", "Moss"].map((n) => (
                          <span
                            key={n}
                            className="text-[8px] px-2 py-0.5 rounded-full border border-parchment/20 text-parchment/50"
                          >
                            {n}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 bg-amber rounded-full py-2.5 text-center">
                      <p className="text-parchment text-[11px] font-medium tracking-wide">
                        Wear today
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing teaser ───────────────────────────────────────── */}
      <section className="py-24 px-6 border-t border-dust">
        <div className="max-w-2xl mx-auto text-center">
          <Eyebrow className="mb-6">Pricing</Eyebrow>
          <h2 className="serif text-4xl md:text-5xl font-light text-ink mb-6 tracking-[0.02em] leading-[1.1]">
            Free to start. Premium when you're ready.
          </h2>
          <p className="text-ash text-base leading-relaxed mb-8">
            The free tier is genuinely useful — daily suggestions, basic
            layering, your first signature. Upgrade when your collection
            outgrows it.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────── */}
      <section
        id="waitlist"
        className="py-24 px-6 bg-ink text-parchment scroll-mt-16"
      >
        <div className="max-w-xl mx-auto text-center">
          <LumiMark
            size={48}
            wingColor="#FAF9F6"
            bodyColor="#B07D2A"
            className="mx-auto mb-8"
          />
          <h2 className="serif text-4xl md:text-5xl font-light leading-[1.1] tracking-[0.02em] mb-4">
            Be first to meet Lumi.
          </h2>
          <p className="serif text-lg font-light italic text-parchment/60 mb-10">
            "Something refined is being built. Early access comes with early
            pricing."
          </p>
          <WaitlistForm />
        </div>
      </section>
    </>
  );
}

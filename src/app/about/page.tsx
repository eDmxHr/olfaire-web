import type { Metadata } from "next";
import { LumiMark } from "@/components/lumi-mark";
import { Eyebrow } from "@/components/ui/eyebrow";

export const metadata: Metadata = {
  title: "About",
  description:
    "The story behind Olfaire and Lumi — a fragrance intelligence built for people who take perfume seriously.",
};

export default function AboutPage() {
  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-20">
          <Eyebrow className="mb-6">About</Eyebrow>
          <h1 className="serif text-5xl md:text-6xl font-light text-ink leading-[1.1] tracking-[0.02em] mb-8">
            Built for the collector who reads Fragrantica.
          </h1>
          <p className="text-ash text-lg leading-relaxed">
            Olfaire started from a simple frustration: owning thirty beautiful
            bottles and reaching for the same three every morning.
          </p>
        </div>

        {/* Story */}
        <div className="space-y-8 text-ash text-base leading-relaxed mb-20">
          <p>
            The fragrance world has no shortage of information. Reviews, lists,
            community ratings, note pyramids. What it lacks is intelligence —
            something that looks at what you actually own, understands the
            chemistry, and helps you make better decisions about what to wear
            and how to combine it.
          </p>
          <p>
            Most apps treat a fragrance collection like a spreadsheet. Olfaire
            treats it like a library — one with a guide who knows every book by
            heart.
          </p>
          <p>
            Lumi is that guide. She was built with one principle: speak like a
            knowledgeable friend, not an algorithm. Never generic. Never
            condescending. Never treating a $30 bottle differently from a $300
            one.
          </p>
        </div>

        {/* Lumi section */}
        <div className="bg-ink rounded-2xl p-8 md:p-12 mb-20">
          <div className="flex items-center gap-4 mb-8">
            <LumiMark size={48} wingColor="#FAF9F6" bodyColor="#B07D2A" />
            <div>
              <Eyebrow variant="dark" className="mb-1">Lumi</Eyebrow>
              <p className="serif text-2xl font-light text-parchment">
                Olfaire's intelligence
              </p>
            </div>
          </div>
          <div className="space-y-5 text-parchment/60 leading-relaxed">
            <p>
              Lumi is a geometric moth — drawn to light, guided by scent. Her
              amber body line is her signature, present in every form.
            </p>
            <p>
              She knows the difference between a chypre and a fougère, how
              vetiver behaves in humid weather, why two seemingly incompatible
              notes sometimes create something extraordinary together.
            </p>
            <p>
              She frames every suggestion as an informed recommendation, never
              an absolute fact. Skin chemistry varies. She knows this.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <Eyebrow variant="ash" className="mb-8">What we believe</Eyebrow>
          <div className="space-y-8">
            {[
              {
                title: "No hierarchy between bottles",
                body: "A $30 bottle gets the same analytical depth as a $300 one. Olfaire doesn't know what you paid and doesn't care.",
              },
              {
                title: "Chemistry over vibes",
                body: "Layering advice built on actual note interactions — which notes anchor, amplify, contrast, or clash, and the chemistry behind why.",
              },
              {
                title: "Your collection, not ours",
                body: "Lumi only recommends what you already own. Discovery features exist, but the daily experience is built around your shelf.",
              },
              {
                title: "Precision over volume",
                body: "One precise sentence is worth more than three vague ones. Lumi says less than you might expect, and means more.",
              },
            ].map(({ title, body }) => (
              <div key={title} className="border-t border-dust pt-8">
                <h3 className="serif text-xl font-light text-ink mb-3">
                  {title}
                </h3>
                <p className="text-ash text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="text-center p-8 bg-linen rounded-2xl">
          <Eyebrow variant="ash" className="mb-4">Get in touch</Eyebrow>
          <p className="serif text-2xl font-light text-ink mb-4">
            Questions, feedback, or just want to talk fragrance?
          </p>
          <a
            href="mailto:lumi@olfaire.app"
            className="text-amber hover:text-ink transition-colors text-sm amber-hover"
          >
            lumi@olfaire.app
          </a>
        </div>
      </div>
    </div>
  );
}

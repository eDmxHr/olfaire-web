import type { Metadata } from "next";
import { LumiMark } from "@/components/lumi-mark";
import { Eyebrow } from "@/components/ui/eyebrow";
import { colors } from "@/lib/colors";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Heading } from "@/components/ui/heading";
import { values } from "@/data/about";
import { FadeUp, StaggerChildren, StaggerItem } from "@/components/ui/animate";

export const metadata: Metadata = {
  title: "About",
  description:
    "The story behind Olfaire and Lumi — a fragrance intelligence built for people who take perfume seriously.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <PageWrapper maxWidth="full">
      {/* Header */}
      <FadeUp className="mb-20">
        <Eyebrow className="mb-6">About</Eyebrow>
        <Heading as="h1" size="page" className="mb-8">
          Built for the collector who reads Fragrantica.
        </Heading>
        <p className="text-ash text-lg leading-relaxed">
          Olfaire started from a simple frustration: owning thirty beautiful
          bottles and reaching for the same three every morning.
        </p>
      </FadeUp>

      {/* Story */}
      <FadeUp delay={0.1} className="space-y-8 text-ash text-base leading-relaxed mb-20">
        <p>
          The fragrance world has no shortage of information. Reviews, lists,
          community ratings, note pyramids. What it lacks is intelligence —
          something that looks at what you actually own, understands the
          chemistry, and helps you make better decisions about what to wear and
          how to combine it.
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
      </FadeUp>

      {/* Lumi section */}
      <FadeUp delay={0.05} className="mb-20">
        <div className="bg-ink rounded-2xl p-8 md:p-12">
          <div className="flex items-center gap-4 mb-8">
            <LumiMark size={48} wingColor={colors.parchment} />
            <div>
              <Eyebrow variant="dark" className="mb-1">
                Lumi
              </Eyebrow>
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
              She knows the difference between a chypre and a fougère, how vetiver
              behaves in humid weather, why two seemingly incompatible notes
              sometimes create something extraordinary together.
            </p>
            <p>
              She frames every suggestion as an informed recommendation, never an
              absolute fact. Skin chemistry varies. She knows this.
            </p>
          </div>
        </div>
      </FadeUp>

      {/* Values */}
      <div className="mb-20">
        <FadeUp>
          <Eyebrow variant="ash" className="mb-8">
            What we believe
          </Eyebrow>
        </FadeUp>
        <StaggerChildren className="space-y-0" stagger={0.08}>
          {values.map(({ title, body }) => (
            <StaggerItem key={title}>
              <div className="border-t border-dust pt-8 pb-8">
                <Heading as="h3" size="card" className="mb-3">
                  {title}
                </Heading>
                <p className="text-ash text-sm leading-relaxed">{body}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>

      {/* Contact */}
      <FadeUp>
        <div className="text-center p-8 bg-linen rounded-2xl">
          <Eyebrow variant="ash" className="mb-4">
            Get in touch
          </Eyebrow>
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
      </FadeUp>
    </PageWrapper>
  );
}

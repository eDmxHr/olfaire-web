import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/ui/eyebrow";

export const metadata: Metadata = {
  title: "Why most layering advice fails",
  description:
    "Most layering guides tell you what smells good together. Almost none explain why. The answer is in the note pyramid.",
};

export default function LayeringAdvicePost() {
  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Back */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-ash text-sm hover:text-ink transition-colors mb-12 amber-hover"
        >
          ← Journal
        </Link>

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[10px] px-3 py-1 rounded-full border bg-amber/10 text-amber border-amber/20">
              Chemistry
            </span>
            <span className="text-ash text-xs">6 min read</span>
            <span className="text-ash text-xs">·</span>
            <span className="text-ash text-xs">May 1, 2026</span>
          </div>
          <h1 className="serif text-4xl md:text-5xl font-light text-ink leading-tight mb-6">
            Why most layering advice fails — and what the chemistry actually
            says
          </h1>
          <p className="serif text-xl font-light italic text-ash leading-relaxed">
            Most layering guides tell you what smells good together. Almost none
            explain why.
          </p>
        </div>

        {/* Article body */}
        <div className="prose-olfaire space-y-6 text-ash leading-relaxed">
          <p>
            Search for fragrance layering advice and you'll find the same
            pattern: lists. "These two smell amazing together." "Try Santal 33
            with Black Opium." Recommendations based on someone's experience,
            passed along as general truth.
          </p>

          <p>
            The problem isn't that the recommendations are wrong. Some of them
            are genuinely excellent. The problem is that without understanding{" "}
            <em>why</em> they work, you can't apply the principle to your own
            collection. You're dependent on someone else's shelf instead of your
            own.
          </p>

          <h2 className="serif text-2xl font-light text-ink mt-10 mb-4">
            The note pyramid is not a static list
          </h2>

          <p>
            Every fragrance has top, heart, and base notes. Most people know
            this. What's less understood is that these notes don't exist
            simultaneously — they're a timeline.
          </p>

          <p>
            Top notes are the first impression: the citrus, the aldehydes, the
            sharp green notes that announce the fragrance and then largely
            disappear within fifteen to thirty minutes. Heart notes are the
            fragrance's true character: the florals, the spices, the woods that
            define what the perfume actually <em>is</em>. Base notes are the
            foundation: the musks, the resins, the heavy woods that fix the
            fragrance and carry it through the day.
          </p>

          <p>
            When you layer two fragrances, you're not mixing static scents.
            You're combining two timelines. The top notes of both will interact
            briefly, then give way. The hearts will dominate for hours. The
            bases will determine what you smell like at the end of the day.
          </p>

          <h2 className="serif text-2xl font-light text-ink mt-10 mb-4">
            The four types of note interaction
          </h2>

          <p>
            When notes from two fragrances meet on skin, they do one of four
            things:
          </p>

          <div className="space-y-5 my-8">
            <div>
              <p className="font-medium text-ink text-sm mb-1">Anchor</p>
              <p className="text-sm">
                One note provides a stable base that allows the other to project
                more freely. Heavy base notes — vetiver, sandalwood, labdanum —
                often anchor lighter florals or citrus, extending their
                longevity and giving them depth they wouldn't have alone.
              </p>
            </div>
            <div>
              <p className="font-medium text-ink text-sm mb-1">Amplify</p>
              <p className="text-sm">
                Two notes share structural chemistry, making both louder. A
                woody musk combined with another woody musk doesn't just add —
                it multiplies. This is often what people are experiencing when
                they say a combination is "greater than the sum of its parts."
              </p>
            </div>
            <div>
              <p className="font-medium text-ink text-sm mb-1">Contrast</p>
              <p className="text-sm">
                Notes from opposing ends of the olfactory spectrum create
                tension. Sweet against bitter. Floral against smoky. When it
                works, the contrast creates complexity and interest. When it
                doesn't, it creates confusion — neither note has room to
                breathe.
              </p>
            </div>
            <div>
              <p className="font-medium text-ink text-sm mb-1">Clash</p>
              <p className="text-sm">
                Some notes have incompatible structural chemistry. Certain
                synthetic musks conflict with natural musks. Some heavy
                orientals overwhelm delicate florals entirely. Understanding
                which combinations tend to clash saves you from experiments that
                will never work, no matter how much you adjust ratios.
              </p>
            </div>
          </div>

          <h2 className="serif text-2xl font-light text-ink mt-10 mb-4">
            What skin does to all of this
          </h2>

          <p>
            Chemistry doesn't happen in the bottle. It happens on skin. And skin
            chemistry varies dramatically between people — which is why the same
            layering combination can be extraordinary on one person and confused
            on another.
          </p>

          <p>
            Dry skin pulls base notes forward quickly, compressing the timeline.
            A layering combination that develops gracefully over four hours on
            oily skin might rush through its stages in ninety minutes on dry
            skin. Oily skin extends longevity, giving base notes more time to
            develop and giving heart notes more presence.
          </p>

          <p>
            This is why "this combination smells amazing" advice is incomplete.
            It smelled amazing on that person's skin. On yours, the same
            combination might tell an entirely different story.
          </p>

          <h2 className="serif text-2xl font-light text-ink mt-10 mb-4">
            The practical implication
          </h2>

          <p>Before layering two fragrances, ask three questions:</p>

          <p>
            What are the shared structural notes between them? If both have
            heavy musks in the base, you're amplifying — decide if you want that
            much projection. If they share a heart note family, the combination
            will likely be harmonious but potentially monotonous.
          </p>

          <p>
            Where do they sit in the pyramid? Two fragrances heavy in top notes
            will create an exciting opening that fades quickly. Two fragrances
            heavy in base notes will be slow to develop but exceptionally
            long-lasting. Balancing a top-heavy fragrance with a base-heavy one
            often creates the most interesting arc.
          </p>

          <p>
            What does your skin do to base notes? If you know your skin burns
            through top notes quickly, apply the fragrance with the top notes
            you want to experience first, and give them time before applying the
            second.
          </p>

          <div className="bg-linen rounded-xl p-6 my-10">
            <Eyebrow className="mb-3">Lumi on this</Eyebrow>
            <p className="serif text-lg font-light italic text-ink leading-relaxed">
              "Understanding layering as chemistry rather than curation changes
              what you're looking for. You stop asking 'what smells good
              together' and start asking 'what does this combination do.' Those
              are very different questions."
            </p>
          </div>

          <p>
            The best layering combinations are rarely accidental. They're the
            result of understanding what each fragrance brings to the
            interaction and choosing deliberately. That's what Olfaire is built
            to help with.
          </p>
        </div>

        {/* Author */}
        <div className="mt-16 pt-8 border-t border-dust flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-ink flex items-center justify-center flex-shrink-0">
            <span className="text-amber text-xs">✦</span>
          </div>
          <div>
            <p className="text-ink text-sm font-medium">Lumi · Olfaire</p>
            <p className="text-ash text-xs">Fragrance intelligence</p>
          </div>
        </div>

        {/* More posts */}
        <div className="mt-16">
          <Eyebrow variant="ash" className="mb-6">
            More from the journal
          </Eyebrow>
          <Link
            href="/blog/understanding-the-note-pyramid"
            className="group block p-6 bg-linen rounded-xl hover:bg-dust/30 transition-colors"
          >
            <p className="text-ash text-xs mb-2">Education · 8 min read</p>
            <p className="serif text-lg font-light text-ink group-hover:text-amber transition-colors">
              The note pyramid: how top, heart, and base notes behave on skin
              over time →
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

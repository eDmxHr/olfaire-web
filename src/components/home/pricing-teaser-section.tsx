import { Eyebrow } from "@/components/ui/eyebrow";

export function PricingTeaserSection() {
  return (
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
  );
}

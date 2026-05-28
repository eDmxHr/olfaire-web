import type { Metadata } from "next";
import { WaitlistForm } from "@/components/waitlist-form";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Olfaire is free to start. Upgrade to Premium for unlimited layering, full chemistry analysis, and more.",
};

const features = {
  free: [
    "Up to 10 bottles in your collection",
    "Daily suggestion (1 per day)",
    "Basic layering explorer (3 uses/day)",
    "1 saved signature",
    "Shareable signature cards",
    "Wishlist",
  ],
  premium: [
    "Unlimited collection",
    "Unlimited layering chemistry",
    "Full chemistry breakdown + application guide",
    "Unlimited saved signatures",
    "Weekly rotation planner",
    "Fragrance DNA profile",
    "Morning ritual push notification",
    "Early access to new features",
  ],
};

export default function PricingPage() {
  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <Eyebrow className="mb-4">Pricing</Eyebrow>
          <h1 className="serif text-5xl md:text-6xl font-light text-ink mb-6 leading-[1.1] tracking-[0.02em]">
            Simple, honest pricing.
          </h1>
          <p className="text-ash text-lg max-w-xl mx-auto leading-relaxed">
            Free is genuinely useful. Premium is for when your collection grows
            past ten bottles and you want Lumi's full intelligence.
          </p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {/* Free */}
          <div className="bg-linen rounded-2xl p-8 flex flex-col">
            <div className="mb-8">
              <Eyebrow variant="ash" className="mb-3">
                Free
              </Eyebrow>
              <div className="flex items-end gap-1">
                <span className="serif text-5xl font-light text-ink">$0</span>
              </div>
              <p className="text-ash text-sm mt-2">Forever free</p>
            </div>
            <div className="space-y-3 mb-8 flex-1">
              {features.free.map((f) => (
                <div key={f} className="flex items-center gap-3">
                  <span className="text-ash">✦</span>
                  <p className="text-ash text-sm leading-relaxed">{f}</p>
                </div>
              ))}
            </div>
            <a
              href="#waitlist"
              className="block text-center border border-dust text-ink px-6 py-3 rounded-full text-sm font-medium hover:border-ink transition-colors mt-auto"
            >
              Get started free
            </a>
          </div>

          {/* Premium Monthly */}
          <div className="bg-ink rounded-2xl p-8 relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background:
                  "radial-gradient(ellipse at 80% 10%, rgba(176,125,42,0.5) 0%, transparent 60%)",
              }}
            />
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-between mb-3">
                <Eyebrow variant="dark">Premium</Eyebrow>
                <Badge className="bg-amber/20 text-amber border-amber/30">
                  POPULAR
                </Badge>
              </div>
              <div className="flex items-end gap-1 mb-1">
                <span className="serif text-5xl font-light text-parchment">
                  $4.99
                </span>
                <span className="text-parchment/50 text-sm mb-2">/month</span>
              </div>
              <p className="text-parchment/50 text-sm mb-8">Billed monthly</p>
              <div className="space-y-3 mb-8 flex-1">
                {features.premium.map((f) => (
                  <div key={f} className="flex items-center gap-3">
                    <span className="text-amber">✦</span>
                    <p className="text-parchment/70 text-sm leading-relaxed">
                      {f}
                    </p>
                  </div>
                ))}
              </div>
              <a
                href="#waitlist"
                className="block text-center bg-amber text-parchment px-6 py-3 rounded-full text-sm font-medium hover:bg-parchment hover:text-ink transition-colors mt-auto"
              >
                Join waitlist
              </a>
            </div>
          </div>

          {/* Annual */}
          <div className="bg-linen rounded-2xl p-8 border-2 border-amber/30 relative flex flex-col">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="bg-amber text-parchment border-amber font-medium">
                33% OFF
              </Badge>
            </div>
            <div className="mb-8 mt-2">
              <Eyebrow variant="ash" className="mb-3">
                Premium Annual
              </Eyebrow>
              <div className="flex items-end gap-1 mb-1">
                <span className="serif text-5xl font-light text-ink">
                  $39.99
                </span>
                <span className="text-ash text-sm mb-2">/year</span>
              </div>
              <p className="text-ash text-sm">$3.33/month — save $20</p>
            </div>
            <div className="space-y-3 mb-8 flex-1">
              {features.premium.map((f) => (
                <div key={f} className="flex items-center gap-3">
                  <span className="text-amber">✦</span>
                  <p className="text-ash text-sm leading-relaxed">{f}</p>
                </div>
              ))}
            </div>
            <a
              href="#waitlist"
              className="block text-center bg-ink text-parchment px-6 py-3 rounded-full text-sm font-medium hover:bg-amber transition-colors mt-auto"
            >
              Join waitlist
            </a>
          </div>
        </div>

        {/* Lifetime */}
        <div className="bg-linen rounded-2xl p-8 md:p-12 mb-20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <Eyebrow className="mb-3">Lifetime</Eyebrow>
              <h2 className="serif text-4xl font-light text-ink mb-4 leading-[1.1] tracking-[0.02em]">
                Own it forever.
              </h2>
              <p className="text-ash text-base leading-relaxed mb-6">
                One payment. Every feature, now and in the future. For the
                collector who knows they're in this for the long term.
              </p>
              <div className="flex items-end gap-2 mb-6">
                <span className="serif text-5xl font-light text-ink">
                  $99.99
                </span>
                <span className="text-ash text-sm mb-2">one-time</span>
              </div>
              <a
                href="#waitlist"
                className="inline-block bg-ink text-parchment px-8 py-3.5 rounded-full text-sm font-medium hover:bg-amber transition-colors"
              >
                Join waitlist for early price
              </a>
            </div>
            <div className="space-y-3">
              {[
                "Everything in Premium, forever",
                "All future features included",
                "Never pay again",
                "Priority support",
                "Supporter recognition (coming soon)",
              ].map((f) => (
                <div key={f} className="flex items-center gap-3">
                  <span className="text-amber">✦</span>
                  <p className="text-ink text-sm">{f}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Launch pricing note */}
        <div className="text-center p-8 border border-amber/20 rounded-2xl bg-amber/5 mb-20">
          <Eyebrow className="mb-3">Launch pricing</Eyebrow>
          <p className="serif text-2xl font-light text-ink mb-3">
            First 500 subscribers get early adopter pricing.
          </p>
          <p className="text-ash text-sm">
            Monthly at $2.99 · Annual at $29.99 · Lifetime at $79.99
          </p>
        </div>

        {/* Waitlist CTA */}
        <div className="max-w-md mx-auto text-center">
          <p className="serif text-2xl font-light italic text-ink mb-6">
            "Join before the early pricing closes."
          </p>
          <WaitlistForm />
        </div>
      </div>
    </div>
  );
}

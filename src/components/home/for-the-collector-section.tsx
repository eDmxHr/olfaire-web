import Image from "next/image";
import { Eyebrow } from "@/components/ui/eyebrow";
import { FeatureItem } from "@/components/ui/feature-item";

export function ForTheCollectorSection() {
  return (
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
                Owns 15–60 bottles. Reads Fragrantica. Frustrated that half her
                shelf never gets worn. Wants a rotation that feels intentional.
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

          <div className="flex justify-center items-center">
            <div className="phone-mockframe w-[300px]">
              <div className="phone-screen bg-ink overflow-hidden relative">
                <Image
                  src="/assets/home.png"
                  alt="Olfaire app"
                  fill
                  className="object-cover object-top"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

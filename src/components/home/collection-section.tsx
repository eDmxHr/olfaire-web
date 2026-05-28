import { Eyebrow } from "@/components/ui/eyebrow";
import { CountUp } from "@/components/count-up";

export function CollectionSection() {
  return (
    <section className="py-24 px-6 border-t border-dust">
      <div className="max-w-4xl mx-auto text-center">
        <Eyebrow className="mb-6">Your collection</Eyebrow>
        <h2 className="serif text-4xl md:text-5xl font-light text-ink mb-8 leading-[1.1] tracking-[0.02em]">
          Every bottle you own,{" "}
          <span className="italic">intelligently organised.</span>
        </h2>
        <p className="text-ash text-lg leading-relaxed max-w-2xl mx-auto mb-16">
          Add your bottles in seconds with automatic fragrance data — full notes
          pyramid, concentration, longevity, sillage. Track what you wear, rate
          what you love, never lose track of what's running low.
        </p>

        <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
          {[
            { number: "1176+", label: "Fragrances in database" },
            { number: "30", label: "Fragrance families" },
            { number: "5", label: "Mood categories" },
          ].map(({ number, label }) => (
            <div key={label} className="flex flex-col gap-4 text-center">
              <CountUp value={number} className="serif text-4xl font-light text-ink mb-1" />
              <p className="text-ash text-sm tracking-wide">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { LumiMark } from "@/components/lumi-mark";
import { WaitlistForm } from "@/components/waitlist-form";

export function FinalCtaSection() {
  return (
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
  );
}

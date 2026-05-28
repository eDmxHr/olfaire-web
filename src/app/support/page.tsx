import type { Metadata } from "next";
import Link from "next/link";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Support",
  description: "Get help with Olfaire — FAQ, contact, and troubleshooting.",
};

const faqs = [
  {
    q: "How does the daily suggestion work?",
    a: "Every morning you select a mood — soft, bold, cosy, sharp, or mysterious. Lumi uses your mood, your collection's note data, and contextual factors like the day and weather to suggest the most fitting bottle from your shelf. The suggestion includes Lumi's reasoning in one precise sentence.",
  },
  {
    q: "What does the layering chemistry analysis actually do?",
    a: "Lumi analyses the note pyramids of two fragrances and identifies how their notes interact — whether they anchor, amplify, contrast, or clash. She provides a compatibility score, an application guide (which bottle first, how long to wait, where to apply), and explains the chemistry behind the recommendation.",
  },
  {
    q: "My fragrance isn't in the database. What do I do?",
    a: "You can add it manually. Enter the house name, fragrance name, and concentration — Lumi will attempt to fill in the notes pyramid and other details automatically. If she's uncertain, the data is flagged and you can edit it. Your contribution will be reviewed and added to the shared catalogue.",
  },
  {
    q: "How do I cancel my subscription?",
    a: "Olfaire subscriptions are managed through Apple. To cancel, go to your iPhone Settings → [your name] → Subscriptions → Olfaire → Cancel. Cancellation takes effect at the end of the current billing period.",
  },
  {
    q: "Can I restore my purchase on a new device?",
    a: 'Yes. Sign in with the same Apple ID or Google account you used originally and tap "Restore purchases" in the Settings screen.',
  },
  {
    q: "How is my fragrance collection data used?",
    a: "Your collection data is used only to power Lumi's suggestions. A minimal, anonymised subset (fragrance names and notes) is sent to the Claude API to generate recommendations. Your name, email, and account details are never included in these requests.",
  },
  {
    q: "What happens when I delete my account?",
    a: "All your data — collection, daily logs, signatures, preferences — is permanently deleted within 30 days. This cannot be undone. Export your collection data first if you want to keep a record.",
  },
  {
    q: "Lumi's suggestion doesn't match my mood. Can I get another?",
    a: 'Yes. On the Daily Pick screen, tap "Suggest another" and Lumi will generate a different recommendation from your collection.',
  },
];

export default function SupportPage() {
  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <p className="eyebrow text-amber mb-4">Support</p>
          <h1 className="serif text-5xl font-light text-ink mb-6">
            How can we help?
          </h1>
          <p className="text-ash text-lg leading-relaxed">
            Answers to common questions below. If you need something else,{" "}
            <a
              href="mailto:lumi@olfaire.app"
              className="text-amber hover:text-ink transition-colors amber-hover"
            >
              email us directly
            </a>
            .
          </p>
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <p className="eyebrow text-ash mb-8">Frequently asked</p>
          <Accordion defaultValue={["0"]}>
            {faqs.map(({ q, a }, i) => (
              <AccordionItem key={i} value={String(i)}>
                <AccordionTrigger>{q}</AccordionTrigger>
                <AccordionContent>{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="border-t border-dust" />
        </div>

        {/* Contact options */}
        <div className="grid sm:grid-cols-2 gap-4 mb-16">
          <a
            href="mailto:lumi@olfaire.app"
            className="group block p-6 bg-linen rounded-2xl hover:bg-dust/40 transition-colors"
          >
            <p className="eyebrow text-ash mb-2">Email</p>
            <p className="serif text-lg font-light text-ink mb-1 group-hover:text-amber transition-colors">
              lumi@olfaire.app
            </p>
            <p className="text-ash text-xs">Response within 24 hours</p>
          </a>

          <a
            href="mailto:lumi@olfaire.app"
            className="group block p-6 bg-linen rounded-2xl hover:bg-dust/40 transition-colors"
          >
            <p className="eyebrow text-ash mb-2">Privacy</p>
            <p className="serif text-lg font-light text-ink mb-1 group-hover:text-amber transition-colors">
              lumi@olfaire.app
            </p>
            <p className="text-ash text-xs">
              Data requests and privacy questions
            </p>
          </a>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-3">
          <Link
            href="/privacy"
            className="text-sm text-ash hover:text-ink transition-colors amber-hover w-fit"
          >
            Privacy Policy →
          </Link>
        </div>
      </div>
    </div>
  );
}

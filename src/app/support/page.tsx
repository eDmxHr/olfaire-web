import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/ui/eyebrow";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Heading } from "@/components/ui/heading";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { faqs } from "@/data/faq";

export const metadata: Metadata = {
  title: "Support",
  description: "Get help with Olfaire — FAQ, contact, and troubleshooting.",
};


export default function SupportPage() {
  return (
    <PageWrapper maxWidth="full">
      {/* Header */}
      <div className="mb-16">
        <Eyebrow className="mb-4">Support</Eyebrow>
        <Heading as="h1" size="page" className="mb-6">
          How can we help?
        </Heading>
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
        <Eyebrow variant="ash" className="mb-8">
          Frequently asked
        </Eyebrow>
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
          <Eyebrow variant="ash" className="mb-2">
            Email
          </Eyebrow>
          <p className="serif text-lg font-light text-ink mb-1 group-hover:text-amber transition-colors">
            lumi@olfaire.app
          </p>
          <p className="text-ash text-xs">Response within 24 hours</p>
        </a>

        <a
          href="mailto:lumi@olfaire.app"
          className="group block p-6 bg-linen rounded-2xl hover:bg-dust/40 transition-colors"
        >
          <Eyebrow variant="ash" className="mb-2">
            Privacy
          </Eyebrow>
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
    </PageWrapper>
  );
}

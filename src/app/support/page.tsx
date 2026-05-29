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
import { FadeUp, StaggerChildren, StaggerItem } from "@/components/ui/animate";

export const metadata: Metadata = {
  title: "Support",
  description: "Get help with Olfaire — FAQ, contact, and troubleshooting.",
  alternates: { canonical: "/support" },
};


export default function SupportPage() {
  return (
    <PageWrapper maxWidth="full">
      {/* Header */}
      <FadeUp className="mb-16">
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
      </FadeUp>

      {/* FAQ */}
      <FadeUp delay={0.05} className="mb-16">
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
      </FadeUp>

      {/* Contact options */}
      <StaggerChildren className="grid sm:grid-cols-2 gap-4 mb-16" stagger={0.1}>
        <StaggerItem>
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
        </StaggerItem>

        <StaggerItem>
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
        </StaggerItem>
      </StaggerChildren>

      {/* Links */}
      <FadeUp>
        <div className="flex flex-col gap-3">
          <Link
            href="/privacy"
            className="text-sm text-ash hover:text-ink transition-colors amber-hover w-fit"
          >
            Privacy Policy →
          </Link>
        </div>
      </FadeUp>
    </PageWrapper>
  );
}

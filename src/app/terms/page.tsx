import type { Metadata } from "next";
import { Eyebrow } from "@/components/ui/eyebrow";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Heading } from "@/components/ui/heading";
import { termsIntro, termsSections } from "@/data/terms";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Olfaire terms and conditions — the rules governing your use of the app and service.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <PageWrapper maxWidth="full">
      <div className="mb-12">
        <Eyebrow className="mb-4">Legal</Eyebrow>
        <Heading as="h1" size="page" className="mb-4">
          Terms & Conditions
        </Heading>
        <p className="text-ash text-sm">Last updated: June 2026</p>
      </div>

      <div className="space-y-10 text-ash leading-relaxed">
        <section>
          <p>{termsIntro}</p>
        </section>

        {termsSections.map(({ heading, content }) => (
          <section key={heading}>
            <Heading as="h2" size="card" className="mb-4">
              {heading}
            </Heading>
            <p className="text-sm">{content}</p>
          </section>
        ))}

        <section>
          <Heading as="h2" size="card" className="mb-4">
            Contact
          </Heading>
          <p className="text-sm">
            Questions about these terms:{" "}
            <a
              href="mailto:lumi@olfaire.app"
              className="text-amber hover:text-ink transition-colors"
            >
              lumi@olfaire.app
            </a>
          </p>
        </section>
      </div>
    </PageWrapper>
  );
}

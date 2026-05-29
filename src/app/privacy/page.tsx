import type { Metadata } from "next";
import { Eyebrow } from "@/components/ui/eyebrow";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Heading } from "@/components/ui/heading";
import { dataUses, thirdParties, userRights } from "@/data/privacy";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Olfaire privacy policy — how we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <PageWrapper maxWidth="full">
      <div className="mb-12">
        <Eyebrow className="mb-4">Legal</Eyebrow>
        <Heading as="h1" size="page" className="mb-4">
          Privacy Policy
        </Heading>
        <p className="text-ash text-sm">Last updated: May 2026</p>
      </div>

      <div className="space-y-10 text-ash leading-relaxed">
        <section>
          <Heading as="h2" size="card" className="mb-4">
            Overview
          </Heading>
          <p>
            Olfaire ("we", "us", "our") is committed to protecting your privacy.
            This policy explains what data we collect, how we use it, and your
            rights regarding your information. By using Olfaire, you agree to
            the practices described here.
          </p>
        </section>

        <section>
          <Heading as="h2" size="card" className="mb-4">
            Data we collect
          </Heading>
          <div className="space-y-4">
            <div>
              <p className="text-ink text-sm font-medium mb-1">
                Account information
              </p>
              <p className="text-sm">
                Your name and email address, provided through Apple Sign In or
                Google OAuth. We do not store your Apple ID or Google account
                password.
              </p>
            </div>
            <div>
              <p className="text-ink text-sm font-medium mb-1">
                Collection data
              </p>
              <p className="text-sm">
                The fragrances you add to your collection, wishlist, wear
                history, ratings, and personal notes. This data lives in your
                account and is used to power Lumi's suggestions.
              </p>
            </div>
            <div>
              <p className="text-ink text-sm font-medium mb-1">Usage data</p>
              <p className="text-sm">
                Daily mood selections, wearing confirmations, ratings, and
                layering sessions. Used to improve suggestion quality over time.
              </p>
            </div>
            <div>
              <p className="text-ink text-sm font-medium mb-1">
                Profile preferences
              </p>
              <p className="text-sm">
                Skin type, lifestyle, preferred fragrance families, and city
                (for weather context). All optional, all editable, all
                deletable.
              </p>
            </div>
            <div>
              <p className="text-ink text-sm font-medium mb-1">Photos</p>
              <p className="text-sm">
                Bottle photos you choose to upload. Stored privately in your
                account. Never shared without your explicit action.
              </p>
            </div>
          </div>
        </section>

        <section>
          <Heading as="h2" size="card" className="mb-4">
            How we use your data
          </Heading>
          <div className="space-y-3">
            {dataUses.map((item) => (
              <div key={item} className="flex items-center gap-3">
                <span className="text-amber flex-shrink-0">✦</span>
                <p className="text-sm">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <Heading as="h2" size="card" className="mb-4">
            Third-party services
          </Heading>
          <div className="space-y-4">
            {thirdParties.map(({ name, desc }) => (
              <div key={name}>
                <p className="text-ink text-sm font-medium mb-1">{name}</p>
                <p className="text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <Heading as="h2" size="card" className="mb-4">
            Data sharing
          </Heading>
          <p className="text-sm mb-4">
            We do not sell your data. We do not share your data with
            advertisers. Your collection, preferences, and usage patterns are
            private to your account.
          </p>
          <p className="text-sm">
            If you choose to make a signature public (Phase 2 social features),
            only the signature name, fragrance names, and compatibility score
            are visible. Your full collection and profile remain private.
          </p>
        </section>

        <section>
          <Heading as="h2" size="card" className="mb-4">
            Your rights
          </Heading>
          <div className="space-y-3">
            {userRights.map((right) => (
              <div key={right} className="flex items-center gap-3">
                <span className="text-amber flex-shrink-0">✦</span>
                <p className="text-sm">You have the right to: {right}</p>
              </div>
            ))}
          </div>
          <p className="text-sm mt-4">
            To exercise any of these rights, email{" "}
            <a
              href="mailto:lumi@olfaire.app"
              className="text-amber hover:text-ink transition-colors"
            >
              lumi@olfaire.app
            </a>{" "}
            or use the delete account option in Settings.
          </p>
        </section>

        <section>
          <Heading as="h2" size="card" className="mb-4">
            Data retention
          </Heading>
          <p className="text-sm">
            Your data is retained for as long as your account is active. When
            you delete your account, all personal data is permanently deleted
            within 30 days. Anonymised, aggregated usage data (with no
            connection to your identity) may be retained for product improvement
            purposes.
          </p>
        </section>

        <section>
          <Heading as="h2" size="card" className="mb-4">
            Children
          </Heading>
          <p className="text-sm">
            Olfaire is not directed at children under 13. We do not knowingly
            collect data from children under 13. If you believe a child has
            provided us data, contact us at{" "}
            <a
              href="mailto:lumi@olfaire.app"
              className="text-amber hover:text-ink transition-colors"
            >
              lumi@olfaire.app
            </a>
            .
          </p>
        </section>

        <section>
          <Heading as="h2" size="card" className="mb-4">
            Changes to this policy
          </Heading>
          <p className="text-sm">
            We may update this policy as Olfaire's features evolve. Material
            changes will be communicated via email or in-app notification.
            Continued use of Olfaire after changes constitutes acceptance of the
            updated policy.
          </p>
        </section>

        <section>
          <Heading as="h2" size="card" className="mb-4">
            Contact
          </Heading>
          <p className="text-sm">
            Questions about this policy:{" "}
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

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { InstagramIcon, TiktokIcon, RedditIcon } from "@hugeicons/core-free-icons";
import { LumiMark } from "./lumi-mark";

const socialLinks = [
  { href: "https://instagram.com/olfaire.app", icon: InstagramIcon, label: "Instagram" },
  { href: "https://tiktok.com/@olfaire.app", icon: TiktokIcon, label: "TikTok" },
  { href: "https://reddit.com/u/olfaire", icon: RedditIcon, label: "Reddit" },
];

export function Footer() {
  return (
    <footer className="border-t border-dust bg-parchment">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <LumiMark size={24} />
              <span className="serif text-lg font-light tracking-[0.12em] text-ink">
                Olfaire
              </span>
            </div>
            <p className="text-ash text-sm leading-relaxed max-w-xs">
              Your scent intelligence. AI-powered daily fragrance picks and
              layering chemistry for people who take perfume seriously.
            </p>
          </div>

          {/* Product */}
          <div>
            <p className="text-xs font-medium tracking-[0.12em] uppercase text-ash mb-4">
              Product
            </p>
            <div className="flex flex-col gap-3">
              {[
                { href: "/about", label: "About Olfaire" },
                { href: "/pricing", label: "Pricing" },
                { href: "/blog", label: "Blog" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-sm text-ash hover:text-ink transition-colors amber-hover w-fit"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <p className="text-xs font-medium tracking-[0.12em] uppercase text-ash mb-4">
              Legal
            </p>
            <div className="flex flex-col gap-3">
              {[
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/support", label: "Support" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-sm text-ash hover:text-ink transition-colors amber-hover w-fit"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-8 border-t border-dust">
          <p className="eyebrow text-ash">
            © {new Date().getFullYear()} Olfaire. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map(({ href, icon, label }) => (
              <Link
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-ash hover:text-ink transition-colors"
              >
                <HugeiconsIcon icon={icon} size={18} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

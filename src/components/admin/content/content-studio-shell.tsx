import Link from "next/link";
import { AdminLogoutButton } from "./admin-logout-button";
import { ContentStudioProviders } from "./content-studio-providers";

const links = [
  { href: "/content", label: "Dashboard" },
  { href: "/content/research", label: "Research" },
  { href: "/content/drafts", label: "Drafts" },
];

export function ContentStudioShell({
  userEmail,
  children,
}: {
  userEmail: string;
  children: React.ReactNode;
}) {
  return (
    <ContentStudioProviders>
      <div className="min-h-screen border-t border-dust bg-parchment pt-16">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="mb-8 flex flex-col gap-4 border-b border-dust pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow text-amber mb-3">Content Studio</p>
              <p className="serif text-3xl font-light text-ink">
                Research, shape, preview, publish.
              </p>
              <p className="mt-2 text-xs text-ash">{userEmail}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full border border-dust px-4 py-2 text-xs font-medium text-ash transition-colors hover:border-ink hover:text-ink"
                >
                  {link.label}
                </Link>
              ))}
              <AdminLogoutButton />
            </div>
          </div>
          {children}
        </div>
      </div>
    </ContentStudioProviders>
  );
}

import Link from "next/link";
import { ContentStudioShell } from "@/components/admin/content/content-studio-shell";
import { SearchConsoleOpportunities } from "@/components/admin/content/search-console-opportunities";
import { getAllPosts } from "@/lib/mdx";
import { requireAdminUser } from "@/lib/admin-auth";
import { listDrafts } from "@/lib/content-studio/drafts";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Content Studio",
};

export default async function ContentDashboardPage() {
  const user = await requireAdminUser();
  const [drafts, posts] = await Promise.all([listDrafts(), getAllPosts()]);
  const activeDrafts = drafts.filter((draft) => draft.status !== "published");

  return (
    <ContentStudioShell userEmail={user.email}>
      <div className="space-y-12">
        <div className="grid border-y border-dust md:grid-cols-4">
          {[
            ["Drafts", activeDrafts.length],
            [
              "In review",
              drafts.filter((draft) => draft.status === "in_review").length,
            ],
            ["Published", posts.length],
            ["Recent activity", drafts.slice(0, 5).length],
          ].map(([label, value]) => (
            <div
              key={label as string}
              className="border-b border-dust py-5 md:border-b-0 md:border-r md:px-6 md:last:border-r-0"
            >
              <p className="text-xs uppercase tracking-accent text-ash">
                {label}
              </p>
              <p className="serif mt-2 text-4xl font-light text-ink">{value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-12 lg:grid-cols-[1.35fr_0.65fr]">
          <section>
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="eyebrow text-amber mb-2">Draft queue</p>
                <h2 className="serif text-3xl font-light text-ink">
                  Articles in motion
                </h2>
              </div>
              <Link
                href="/content/research"
                className="inline-flex h-10 items-center justify-center rounded-full border border-dust px-5 py-2.5 text-sm font-medium tracking-wide text-ink transition-colors hover:border-ink"
              >
                Create article
              </Link>
            </div>
            <div className="border-y border-dust">
              {drafts.slice(0, 6).map((draft) => (
                <Link
                  href={`/content/editor/${draft.id}`}
                  key={draft.id}
                  className="group block border-b border-dust py-5 last:border-b-0"
                >
                  <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
                    <div>
                      <p className="font-medium text-ink group-hover:text-amber">
                        {draft.frontmatter.title}
                      </p>
                      <p className="mt-1 text-sm text-ash">
                        {draft.input.keyword} · {draft.slug}.mdx
                      </p>
                    </div>
                    <Badge className="border-dust bg-white/60 text-ash">
                      {draft.status.replace("_", " ")}
                    </Badge>
                  </div>
                </Link>
              ))}
              {!drafts.length && (
                <p className="py-8 text-sm text-ash">
                  No drafts yet. Start with research.
                </p>
              )}
            </div>
          </section>

          <aside className="space-y-10">
            <section>
              <p className="eyebrow text-amber mb-4">Topic planning</p>
              <p className="text-sm leading-relaxed text-ash">
                Use the research workspace to pull live topic ideas from Search
                Console and Tavily before choosing an article.
              </p>
              <Link
                href="/content/research"
                className="mt-4 inline-flex h-10 items-center justify-center rounded-full border border-dust px-5 py-2.5 text-sm font-medium tracking-wide text-ink transition-colors hover:border-ink"
              >
                Open topic ideas
              </Link>
            </section>

            <SearchConsoleOpportunities />
          </aside>
        </div>
      </div>
    </ContentStudioShell>
  );
}

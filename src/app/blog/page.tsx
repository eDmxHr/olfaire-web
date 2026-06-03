import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Badge } from "@/components/ui/badge";
import { amberAlpha } from "@/lib/colors";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Heading } from "@/components/ui/heading";
import { FadeUp, StaggerChildren, StaggerItem } from "@/components/ui/animate";
import { getAllPosts } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Fragrance chemistry, layering guides, and scent intelligence from the Olfaire team.",
  alternates: { canonical: "/blog" },
};

const categoryColors: Record<string, string> = {
  Chemistry: "bg-amber/10 text-amber border-amber/20",
  Education: "bg-ink/6 text-ash border-dust",
  Science: "bg-ink/6 text-ash border-dust",
  Families: "bg-ink/6 text-ash border-dust",
  Collection: "bg-ink/6 text-ash border-dust",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <PageWrapper maxWidth="full">
      {/* Header */}
      <FadeUp className="mb-16">
        <Eyebrow className="mb-4">Blog</Eyebrow>
        <Heading as="h1" size="page" className="mb-6">
          Fragrance intelligence.
        </Heading>
        <p className="text-ash text-lg leading-relaxed max-w-xl">
          Chemistry breakdowns, layering guides, and everything Lumi knows about
          scent — written for collectors who want more than opinions.
        </p>
      </FadeUp>

      {/* Featured post */}
      {posts[0] && (
        <FadeUp delay={0.1} className="mb-12">
          <Link href={`/blog/${posts[0].slug}`} className="group block">
            <div className="bg-ink rounded-2xl p-8 md:p-12 relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  background: `radial-gradient(ellipse at 80% 20%, ${amberAlpha(0.6)} 0%, transparent 60%)`,
                }}
              />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <Badge
                    className={
                      categoryColors[posts[0].category] ??
                      "bg-ink/6 text-ash border-dust"
                    }
                  >
                    {posts[0].category}
                  </Badge>
                  <span className="text-parchment/30 text-xs">
                    {posts[0].readTime}
                  </span>
                </div>
                <h2 className="serif text-3xl md:text-4xl font-light text-parchment leading-[1.1] tracking-[0.02em] mb-4 group-hover:text-amber transition-colors">
                  {posts[0].title}
                </h2>
                <p className="text-parchment/50 leading-relaxed mb-6 text-sm">
                  {posts[0].excerpt}
                </p>
                <div className="flex items-center gap-2 text-amber text-sm">
                  <span>Read article</span>
                  <span className="group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </FadeUp>
      )}

      {/* Post list */}
      <StaggerChildren className="space-y-0" stagger={0.08}>
        {posts.slice(1).map((post) => (
          <StaggerItem key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="group block py-8 border-t border-dust"
            >
              <div className="flex items-start gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge
                      className={
                        categoryColors[post.category] ??
                        "bg-ink/6 text-ash border-dust"
                      }
                    >
                      {post.category}
                    </Badge>
                    <span className="text-ash text-xs">{post.readTime}</span>
                  </div>
                  <h2 className="serif text-xl font-light text-ink leading-tight mb-2 group-hover:text-amber transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-ash text-sm leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>
                <span className="text-dust group-hover:text-amber group-hover:translate-x-1 transition-all mt-1 flex-shrink-0">
                  →
                </span>
              </div>
            </Link>
          </StaggerItem>
        ))}
      </StaggerChildren>
    </PageWrapper>
  );
}

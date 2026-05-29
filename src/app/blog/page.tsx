import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Badge } from "@/components/ui/badge";
import { amberAlpha } from "@/lib/colors";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Heading } from "@/components/ui/heading";
export const metadata: Metadata = {
  title: "Journal",
  description:
    "Fragrance chemistry, layering guides, and scent intelligence from the Olfaire team.",
};

// Starter blog posts — replace with MDX or CMS later
const posts = [
  {
    slug: "why-layering-advice-fails",
    date: "2026-05-01",
    category: "Chemistry",
    title: "Why most layering advice fails — and what the chemistry actually says",
    excerpt: "Most layering guides tell you what smells good together. Almost none explain why. The answer is in the note pyramid, and it changes everything about how you combine fragrances.",
    readTime: "6 min read",
  },
  {
    slug: "understanding-the-note-pyramid",
    date: "2026-04-18",
    category: "Education",
    title: "The note pyramid: how top, heart, and base notes behave on skin over time",
    excerpt: "A fragrance is not a static thing. It evolves. Understanding how top, heart, and base notes unfold — and how skin type accelerates or slows each stage — changes how you choose what to wear.",
    readTime: "8 min read",
  },
  {
    slug: "skin-type-and-fragrance",
    date: "2026-04-05",
    category: "Science",
    title: "How your skin type changes every fragrance you own",
    excerpt: "Dry skin pulls base notes forward quickly. Oily skin deepens and extends them. Warm skin burns through top notes in minutes. The same bottle smells different on everyone — here's why.",
    readTime: "5 min read",
  },
  {
    slug: "oud-the-complete-guide",
    date: "2026-03-22",
    category: "Families",
    title: "Oud: the complete guide to the most complex note in perfumery",
    excerpt: "No note divides collectors more than oud. Animalic, woody, medicinal, sweet — it can be all of these at once. Understanding what makes a good oud fragrance starts with understanding the wood itself.",
    readTime: "10 min read",
  },
  {
    slug: "building-a-seasonal-rotation",
    date: "2026-03-10",
    category: "Collection",
    title: "Building a seasonal rotation: what your collection might be missing",
    excerpt: "Most collectors unconsciously build around a single season or mood. A deliberate rotation — one that accounts for weather, occasion, and the gaps in your shelf — changes how often you actually reach for what you own.",
    readTime: "7 min read",
  },
];

const categoryColors: Record<string, string> = {
  Chemistry:  "bg-amber/10 text-amber border-amber/20",
  Education:  "bg-ink/6 text-ash border-dust",
  Science:    "bg-ink/6 text-ash border-dust",
  Families:   "bg-ink/6 text-ash border-dust",
  Collection: "bg-ink/6 text-ash border-dust",
};

export default function BlogPage() {
  return (
    <PageWrapper maxWidth="full">
      {/* Header */}
      <div className="mb-16">
        <Eyebrow className="mb-4">Journal</Eyebrow>
        <Heading as="h1" size="page" className="mb-6">
          Fragrance intelligence.
        </Heading>
        <p className="text-ash text-lg leading-relaxed max-w-xl">
          Chemistry breakdowns, layering guides, and everything Lumi knows about
          scent — written for collectors who want more than opinions.
        </p>
      </div>

      {/* Featured post */}
      <Link href={`/blog/${posts[0].slug}`} className="group block mb-12">
        <div className="bg-ink rounded-2xl p-8 md:p-12 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background: `radial-gradient(ellipse at 80% 20%, ${amberAlpha(0.6)} 0%, transparent 60%)`,
            }}
          />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <Badge className={categoryColors[posts[0].category]}>
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

      {/* Post list */}
      <div className="space-y-0">
        {posts.slice(1).map((post, i) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block py-8 border-t border-dust"
          >
            <div className="flex items-start gap-6">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-3">
                  <Badge className={categoryColors[post.category]}>
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
        ))}
      </div>
    </PageWrapper>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import Image from "next/image";
import logoImg from "../../../../public/logo.png";
import { Eyebrow } from "@/components/ui/eyebrow";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Heading } from "@/components/ui/heading";
import { Badge } from "@/components/ui/badge";
import { getAllPosts, getPostBySlug } from "@/lib/mdx";
import { FadeUp } from "@/components/ui/animate";
type MDXComponents = Record<
  string,
  React.ComponentType<Record<string, unknown>>
>;

const categoryColors: Record<string, string> = {
  Chemistry: "bg-amber/10 text-amber border-amber/20",
  Education: "bg-ink/6 text-ash border-dust",
  Science: "bg-ink/6 text-ash border-dust",
  Families: "bg-ink/6 text-ash border-dust",
  Collection: "bg-ink/6 text-ash border-dust",
};

type MDXChild = { children?: React.ReactNode };

const mdxComponents: MDXComponents = {
  h1: ({ children }: MDXChild) => (
    <Heading as="h1" size="page" className="mb-6">
      {children}
    </Heading>
  ),
  h2: ({ children }: MDXChild) => (
    <Heading as="h2" size="card" className="mt-10 mb-4">
      {children}
    </Heading>
  ),
  h3: ({ children }: MDXChild) => (
    <h3 className="text-ink font-medium text-base mt-8 mb-3">{children}</h3>
  ),
  p: ({ children }: MDXChild) => (
    <p className="text-ash leading-relaxed">{children}</p>
  ),
  strong: ({ children }: MDXChild) => (
    <strong className="font-medium text-ink">{children}</strong>
  ),
  em: ({ children }: MDXChild) => (
    <em className="italic text-ash">{children}</em>
  ),
  ul: ({ children }: MDXChild) => (
    <ul className="list-disc list-inside space-y-2 text-ash text-sm leading-relaxed">
      {children}
    </ul>
  ),
  ol: ({ children }: MDXChild) => (
    <ol className="list-decimal list-inside space-y-2 text-ash text-sm leading-relaxed">
      {children}
    </ol>
  ),
  blockquote: ({ children }: MDXChild) => (
    <blockquote className="bg-linen rounded-xl p-6 my-8 border-l-2 border-amber">
      <p className="serif text-lg font-light italic text-ink leading-relaxed m-0">
        {children}
      </p>
    </blockquote>
  ),
  hr: () => <hr className="border-dust my-10" />,
};

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = getPostBySlug(slug);
    return {
      title: post.title,
      description: post.excerpt,
      alternates: { canonical: `/blog/${slug}` },
      openGraph: {
        title: post.title,
        description: post.excerpt,
        type: "article",
        publishedTime: post.date,
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: post.excerpt,
      },
    };
  } catch {
    return {};
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let post;
  try {
    post = getPostBySlug(slug);
  } catch {
    notFound();
  }

  let PostContent: React.ComponentType<{ components?: MDXComponents }>;
  try {
    const { default: MdxContent } = await evaluate(post.content, {
      ...runtime,
      baseUrl: import.meta.url,
    });
    PostContent = MdxContent as React.ComponentType<{
      components?: MDXComponents;
    }>;
  } catch {
    notFound();
  }

  return (
    <PageWrapper maxWidth="md">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            datePublished: post.date,
            dateModified: post.date,
            author: {
              "@type": "Organization",
              name: "Olfaire",
              url: "https://olfaire.app",
            },
            publisher: {
              "@type": "Organization",
              name: "Olfaire",
              logo: {
                "@type": "ImageObject",
                url: "https://olfaire.app/logo.png",
              },
            },
            url: `https://olfaire.app/blog/${slug}`,
            image: `https://olfaire.app/blog/${slug}/opengraph-image`,
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://olfaire.app/blog/${slug}`,
            },
          }),
        }}
      />
      {/* Back */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-ash text-sm hover:text-ink transition-colors mb-12 amber-hover"
      >
        ← Blog
      </Link>

      {/* Header */}
      <FadeUp className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <Badge
            className={
              categoryColors[post.category] ?? "bg-ink/6 text-ash border-dust"
            }
          >
            {post.category}
          </Badge>
          <span className="text-ash text-xs">{post.readTime}</span>
          <span className="text-ash text-xs">·</span>
          <span className="text-ash text-xs">
            {new Date(post.date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
        <Heading as="h1" size="page" className="mb-6">
          {post.title}
        </Heading>
        <p className="serif text-xl font-light italic text-ash leading-relaxed">
          {post.excerpt}
        </p>
      </FadeUp>

      {/* Article body */}
      <FadeUp delay={0.1} className="prose-olfaire space-y-6">
        <PostContent components={mdxComponents} />
      </FadeUp>

      {/* Author */}
      <div className="mt-16 pt-8 border-t border-dust flex items-center gap-4">
        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
          <Image
            src={logoImg}
            alt="Olfaire"
            width={40}
            height={40}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <p className="text-ink text-sm font-medium">Lumi · Olfaire</p>
          <p className="text-ash text-xs">Fragrance intelligence</p>
        </div>
      </div>

      {/* More posts */}
      <div className="mt-16">
        <Eyebrow variant="ash" className="mb-6">
          More from the blog
        </Eyebrow>
        <Link
          href="/blog"
          className="group block p-6 bg-linen rounded-xl hover:bg-dust/30 transition-colors"
        >
          <p className="serif text-lg font-light text-ink group-hover:text-amber transition-colors">
            Back to all articles →
          </p>
        </Link>
      </div>
    </PageWrapper>
  );
}

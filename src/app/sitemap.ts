import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/mdx";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const postEntries = posts.map((post) => ({
    url: `https://olfaire.app/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "yearly" as const,
    priority: 0.7,
  }));

  return [
    { url: "https://olfaire.app",         lastModified: new Date(), changeFrequency: "weekly",  priority: 1   },
    { url: "https://olfaire.app/about",   lastModified: new Date("2026-05-01"), changeFrequency: "monthly", priority: 0.8 },
    { url: "https://olfaire.app/pricing", lastModified: new Date("2026-05-01"), changeFrequency: "monthly", priority: 0.9 },
    { url: "https://olfaire.app/blog",    lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
    { url: "https://olfaire.app/support", lastModified: new Date("2026-05-01"), changeFrequency: "monthly", priority: 0.6 },
    { url: "https://olfaire.app/privacy", lastModified: new Date("2026-05-01"), changeFrequency: "yearly",  priority: 0.4 },
    ...postEntries,
  ];
}

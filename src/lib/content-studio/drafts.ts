import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import matter from "gray-matter";
import type {
  ContentDraft,
  ContentStudioInput,
  DraftFrontmatter,
  DraftStatus,
  ResearchResult,
} from "./types";
import { frontmatterToMdx, slugify } from "./utils";

const DRAFT_ROOT = path.join(process.cwd(), ".content-studio", "drafts");
const BLOG_ROOT = path.join(process.cwd(), "src/content/blog");

async function ensureDraftRoot() {
  await fs.mkdir(DRAFT_ROOT, { recursive: true });
}

function draftPath(id: string) {
  return path.join(DRAFT_ROOT, `${id}.json`);
}

function assertSafeSlug(slug: string) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error("Slug must contain only lowercase letters, numbers, and hyphens.");
  }
}

export async function listDrafts() {
  await ensureDraftRoot();
  const files = await fs.readdir(DRAFT_ROOT);
  const drafts = await Promise.all(
    files
      .filter((file) => file.endsWith(".json"))
      .map(async (file) => {
        const raw = await fs.readFile(path.join(DRAFT_ROOT, file), "utf-8");
        return JSON.parse(raw) as ContentDraft;
      }),
  );

  return drafts.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

export async function getDraft(id: string) {
  const raw = await fs.readFile(draftPath(id), "utf-8");
  return JSON.parse(raw) as ContentDraft;
}

export async function saveDraft(draft: ContentDraft) {
  await ensureDraftRoot();
  await fs.writeFile(draftPath(draft.id), `${JSON.stringify(draft, null, 2)}\n`);
  return draft;
}

export async function deleteDraft(id: string) {
  await fs.unlink(draftPath(id));
}

function makeGeneratorBrief(input: ContentStudioInput, research?: ResearchResult) {
  return [
    `Write an original Olfaire blog article about "${input.title}".`,
    `Target keyword: ${input.keyword}.`,
    `Audience: ${input.audience}.`,
    `Category: ${input.category}.`,
    "Voice: sensory, literary, concise, and useful; never copy competitors; do not use Olfaire's fragrance database.",
    research ? `Search intent: ${research.searchIntent}` : "",
    research ? `Angle: ${research.suggestedAngle}` : "",
    research ? `Tension: ${research.tension}` : "",
    research?.contentGaps?.length
      ? `Content gaps to fill:\n${research.contentGaps.map((gap) => `- ${gap}`).join("\n")}`
      : "",
    research?.recommendedOutline?.length
      ? `Recommended outline:\n${research.recommendedOutline.map((heading) => `- ${heading}`).join("\n")}`
      : "",
    input.notes ? `Editorial notes: ${input.notes}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");
}

export async function createDraft(input: ContentStudioInput, research?: ResearchResult) {
  const now = new Date().toISOString();
  const id = crypto.randomUUID();
  const slug = slugify(research?.suggestedSlug || input.title || input.keyword);
  const mdx = "";
  const frontmatter: DraftFrontmatter = {
    title: input.title,
    date: now.slice(0, 10),
    category: input.category,
    excerpt:
      research?.metaDescription ??
      `A clear Olfaire guide to ${input.keyword} for fragrance readers.`,
    readTime: "1 min read",
  };

  const draft: ContentDraft = {
    id,
    status: "draft",
    slug,
    input,
    frontmatter,
    mdx,
    seoTitle: research?.seoTitle ?? `${input.title} | Olfaire`,
    metaDescription: research?.metaDescription ?? frontmatter.excerpt,
    generatorBrief: makeGeneratorBrief(input, research),
    research,
    createdAt: now,
    updatedAt: now,
  };

  return saveDraft(draft);
}

export async function updateDraft(
  id: string,
  patch: Partial<
    Pick<
      ContentDraft,
      | "slug"
      | "status"
      | "frontmatter"
      | "mdx"
      | "seoTitle"
      | "metaDescription"
      | "generatorBrief"
      | "research"
    >
  >,
) {
  const current = await getDraft(id);
  const next: ContentDraft = {
    ...current,
    ...patch,
    status: (patch.status ?? current.status) as DraftStatus,
    frontmatter: {
      ...current.frontmatter,
      ...(patch.frontmatter ?? {}),
    },
    updatedAt: new Date().toISOString(),
  };

  if (patch.slug) {
    next.slug = slugify(patch.slug);
  }

  return saveDraft(next);
}

export async function publishDraft(id: string) {
  const draft = await getDraft(id);
  const slug = slugify(draft.slug);
  assertSafeSlug(slug);

  const filePath = path.join(BLOG_ROOT, `${slug}.mdx`);
  try {
    await fs.access(filePath);
    throw new Error(`A blog article already exists at ${slug}.mdx.`);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }

  const parsed = matter(frontmatterToMdx(draft.frontmatter, draft.mdx));
  const content = frontmatterToMdx(
    {
      title: String(parsed.data.title ?? draft.frontmatter.title),
      date: String(parsed.data.date ?? draft.frontmatter.date),
      category: String(parsed.data.category ?? draft.frontmatter.category),
      excerpt: String(parsed.data.excerpt ?? draft.frontmatter.excerpt),
      readTime: String(parsed.data.readTime ?? draft.frontmatter.readTime),
    },
    parsed.content,
  );

  await fs.writeFile(filePath, content, { flag: "wx" });

  const now = new Date().toISOString();
  return saveDraft({
    ...draft,
    status: "published",
    slug,
    publishedPath: filePath,
    publishedAt: now,
    updatedAt: now,
  });
}

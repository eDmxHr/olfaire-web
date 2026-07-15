import "server-only";

import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import matter from "gray-matter";
import { createClient } from "@supabase/supabase-js";
import type {
  ContentDraft,
  ContentStudioInput,
  DraftFrontmatter,
  DraftStatus,
  ResearchResult,
} from "./types";
import { commitBlogPost, isGitHubPublishingConfigured } from "./github";
import { frontmatterToMdx, slugify } from "./utils";

const BLOG_ROOT = path.join(process.cwd(), "src/content/blog");
const DRAFT_TABLE = "content_studio_drafts";

interface DraftRow {
  id: string;
  status: DraftStatus;
  slug: string;
  input: ContentStudioInput;
  frontmatter: DraftFrontmatter;
  mdx: string;
  seo_title: string;
  meta_description: string;
  generator_brief: string;
  research: ResearchResult | null;
  published_path: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

function isStorageUnavailable(error: unknown) {
  const code = (error as NodeJS.ErrnoException).code;
  return code === "EROFS" || code === "EACCES" || code === "EPERM";
}

function assertSafeSlug(slug: string) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error("Slug must contain only lowercase letters, numbers, and hyphens.");
  }
}

function getDraftClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase draft storage is not configured.");
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function rowToDraft(row: DraftRow): ContentDraft {
  return {
    id: row.id,
    status: row.status,
    slug: row.slug,
    input: row.input,
    frontmatter: row.frontmatter,
    mdx: row.mdx ?? "",
    seoTitle: row.seo_title,
    metaDescription: row.meta_description,
    generatorBrief: row.generator_brief,
    research: row.research ?? undefined,
    publishedPath: row.published_path ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    publishedAt: row.published_at ?? undefined,
  };
}

function draftToRow(draft: ContentDraft): DraftRow {
  return {
    id: draft.id,
    status: draft.status,
    slug: draft.slug,
    input: draft.input,
    frontmatter: draft.frontmatter,
    mdx: draft.mdx,
    seo_title: draft.seoTitle,
    meta_description: draft.metaDescription,
    generator_brief: draft.generatorBrief,
    research: draft.research ?? null,
    published_path: draft.publishedPath ?? null,
    created_at: draft.createdAt,
    updated_at: draft.updatedAt,
    published_at: draft.publishedAt ?? null,
  };
}

function supabaseError(error: { message: string } | null, fallback: string) {
  if (!error) return null;
  return new Error(error.message || fallback);
}

export async function listDrafts() {
  let supabase: ReturnType<typeof getDraftClient>;
  try {
    supabase = getDraftClient();
  } catch {
    return [];
  }

  const { data, error } = await supabase
    .from(DRAFT_TABLE)
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    return [];
  }

  return ((data ?? []) as DraftRow[]).map(rowToDraft);
}

export async function getDraft(id: string) {
  const supabase = getDraftClient();
  const { data, error } = await supabase
    .from(DRAFT_TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  const failure = supabaseError(error, "Unable to load draft.");
  if (failure) throw failure;
  if (!data) throw new Error("Draft not found.");

  return rowToDraft(data as DraftRow);
}

export async function saveDraft(draft: ContentDraft) {
  const supabase = getDraftClient();
  const { data, error } = await supabase
    .from(DRAFT_TABLE)
    .upsert(draftToRow(draft), { onConflict: "id" })
    .select("*")
    .single();

  const failure = supabaseError(error, "Unable to save draft.");
  if (failure) throw failure;

  return rowToDraft(data as DraftRow);
}

export async function deleteDraft(id: string) {
  const supabase = getDraftClient();
  const { error } = await supabase.from(DRAFT_TABLE).delete().eq("id", id);

  const failure = supabaseError(error, "Unable to delete draft.");
  if (failure) throw failure;
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

type DraftPatch = Partial<
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
>;

const DRAFT_STATUSES: DraftStatus[] = ["draft", "in_review", "published"];

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function sanitizeDraftPatch(raw: unknown): DraftPatch {
  if (!isPlainObject(raw)) return {};

  const patch: DraftPatch = {};

  for (const field of ["slug", "mdx", "seoTitle", "metaDescription", "generatorBrief"] as const) {
    if (typeof raw[field] === "string") {
      patch[field] = raw[field] as string;
    }
  }

  if (typeof raw.status === "string" && DRAFT_STATUSES.includes(raw.status as DraftStatus)) {
    patch.status = raw.status as DraftStatus;
  }

  if (isPlainObject(raw.frontmatter)) {
    patch.frontmatter = raw.frontmatter as unknown as ContentDraft["frontmatter"];
  }

  if (isPlainObject(raw.research)) {
    patch.research = raw.research as unknown as ContentDraft["research"];
  }

  return patch;
}

export async function updateDraft(id: string, patch: DraftPatch) {
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

async function writeLocalBlogPost(slug: string, content: string) {
  const filePath = path.join(BLOG_ROOT, `${slug}.mdx`);

  try {
    await fs.access(filePath);
    throw new Error(`A blog article already exists at ${slug}.mdx.`);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }

  try {
    await fs.writeFile(filePath, content, { flag: "wx" });
  } catch (error) {
    if (isStorageUnavailable(error)) {
      throw new Error(
        "Publishing requires a writable local project filesystem, or a configured GITHUB_TOKEN.",
      );
    }
    throw error;
  }

  return filePath;
}

export async function publishDraft(id: string) {
  const draft = await getDraft(id);
  const slug = slugify(draft.slug);
  assertSafeSlug(slug);

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

  // Prefer committing to GitHub so publishing works from the deployed studio
  // (Vercel's filesystem is read-only). Falls back to a local write for
  // tokenless local development.
  const publishedPath = isGitHubPublishingConfigured()
    ? await commitBlogPost(
        slug,
        content,
        `content: publish ${slug}.mdx via Content Studio`,
      )
    : await writeLocalBlogPost(slug, content);

  const now = new Date().toISOString();
  return saveDraft({
    ...draft,
    status: "published",
    slug,
    publishedPath,
    publishedAt: now,
    updatedAt: now,
  });
}

import type { ContentStudioInput, DraftFrontmatter } from "./types";

const SOURCE_SUFFIX_PATTERN =
  /\s+-\s+(reddit|youtube|tiktok|fragrantica|byrdie|vogue|gq|esquire|allure|marie claire|who what wear).*$/i;
const TITLE_MODIFIER_PATTERN =
  /\b(deep dive|complete guide|ultimate guide|best scents?|top picks?|reviewed|ranked)\b.*$/i;
const PERFORMANCE_SUFFIX_PATTERN =
  /\b(notes|longevity|sillage|projection)\b.*$/i;
const TITLE_LIKE_KEYWORD_PATTERN =
  /:|\b(deep dive|best scents?|ultimate guide|complete guide)\b/i;

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

export function cleanContentStudioText(value: string) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/\[(.*?)\]\([^)]+\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&ocirc;/g, "o")
    .replace(SOURCE_SUFFIX_PATTERN, "")
    .replace(/\s+\|\s+.*$/g, "")
    .replace(/\s+/g, " ")
    .replace(/^["'“”‘’\s:,-]+/, "")
    .replace(/["'“”‘’\s:,-]+$/, "")
    .trim();
}

export function normalizeResearchKeyword(value: string) {
  const cleaned = cleanContentStudioText(value);
  const lead = cleaned.split(":")[0]?.trim() || cleaned;
  const normalized = lead
    .replace(TITLE_MODIFIER_PATTERN, "")
    .replace(PERFORMANCE_SUFFIX_PATTERN, "")
    .replace(/\s+/g, " ")
    .trim();

  return (normalized || cleaned).toLowerCase();
}

export function titleCase(value: string) {
  const lowerWords = new Set([
    "a",
    "an",
    "and",
    "as",
    "at",
    "but",
    "by",
    "for",
    "from",
    "in",
    "into",
    "nor",
    "of",
    "on",
    "or",
    "the",
    "to",
    "vs",
    "with",
  ]);

  return value
    .toLowerCase()
    .split(/\s+/)
    .map((word, index) => {
      if (index > 0 && lowerWords.has(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

export function articleTitleFromTopic(value: string) {
  const cleaned = cleanContentStudioText(value);

  if (!cleaned) return "";
  if (cleaned.endsWith("?")) return cleaned;

  const keyword = normalizeResearchKeyword(cleaned);
  const title = titleCase(keyword);

  if (/\b(oud|agarwood)\b/i.test(keyword)) {
    return `${title}: Notes, Longevity, and How to Choose One`;
  }

  if (/\b(layer|layering)\b/i.test(keyword)) {
    return `${title}: How to Build Combinations That Work on Skin`;
  }

  if (/\b(skin chemistry|last|longevity|projection|sillage)\b/i.test(keyword)) {
    return `${title}: Why Fragrance Changes When You Wear It`;
  }

  if (/\b(store|storage|collection)\b/i.test(keyword)) {
    return `${title}: How to Protect and Understand Your Collection`;
  }

  return `${title} Guide`;
}

export function normalizeContentStudioInput(
  input: ContentStudioInput,
): ContentStudioInput {
  const keyword = normalizeResearchKeyword(input.keyword);
  const cleanedTitle = cleanContentStudioText(input.title);
  const titleLooksLikeKeyword = Boolean(
    cleanedTitle &&
      normalizeResearchKeyword(cleanedTitle) === keyword &&
      (cleanedTitle === input.keyword ||
        TITLE_LIKE_KEYWORD_PATTERN.test(cleanedTitle)),
  );

  return {
    ...input,
    title: titleLooksLikeKeyword
      ? articleTitleFromTopic(input.title || input.keyword)
      : cleanedTitle,
    keyword,
    category: cleanContentStudioText(input.category),
    audience: cleanContentStudioText(input.audience),
    notes: input.notes ? cleanContentStudioText(input.notes) : undefined,
  };
}

export function estimateReadTime(mdx: string) {
  const wordCount = mdx
    .replace(/---[\s\S]*?---/, "")
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return `${Math.max(1, Math.ceil(wordCount / 220))} min read`;
}

export function escapeYaml(value: string) {
  return JSON.stringify(value ?? "");
}

export function frontmatterToMdx(frontmatter: DraftFrontmatter, mdx: string) {
  const body = mdx.replace(/^---[\s\S]*?---\s*/, "").trim();
  return `---\ntitle: ${escapeYaml(frontmatter.title)}\ndate: ${escapeYaml(frontmatter.date)}\ncategory: ${escapeYaml(frontmatter.category)}\nexcerpt: ${escapeYaml(frontmatter.excerpt)}\nreadTime: ${escapeYaml(frontmatter.readTime)}\n---\n\n${body}\n`;
}

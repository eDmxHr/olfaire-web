export type DraftStatus = "draft" | "in_review" | "published";

export interface ContentStudioInput {
  title: string;
  keyword: string;
  category: string;
  audience: string;
  notes?: string;
}

export interface ResearchResult {
  keyword: string;
  summary: string;
  searchIntent: string;
  suggestedAngle: string;
  tension: string;
  competitorHeadings: string[];
  commonQuestions: string[];
  contentGaps: string[];
  recommendedOutline: string[];
  seoTitle: string;
  metaDescription: string;
  suggestedSlug: string;
  internalLinks: Array<{
    title: string;
    slug: string;
    reason: string;
  }>;
  topResults: Array<{
    title: string;
    url: string;
    snippet: string;
  }>;
}

export interface DraftFrontmatter {
  title: string;
  date: string;
  category: string;
  excerpt: string;
  readTime: string;
}

export interface ContentDraft {
  id: string;
  status: DraftStatus;
  slug: string;
  input: ContentStudioInput;
  frontmatter: DraftFrontmatter;
  mdx: string;
  seoTitle: string;
  metaDescription: string;
  generatorBrief: string;
  research?: ResearchResult;
  publishedPath?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

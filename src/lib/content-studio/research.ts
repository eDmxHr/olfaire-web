import { getAllPosts } from "@/lib/mdx";
import {
  cleanContentStudioText,
  normalizeResearchKeyword,
  slugify,
  titleCase,
} from "./utils";
import type { ContentStudioInput, ResearchResult } from "./types";

interface ResearchService {
  search(input: ContentStudioInput): Promise<ResearchResult>;
}

interface TavilyResult {
  title?: string;
  url?: string;
  content?: string;
  raw_content?: string;
}

interface TavilyResponse {
  answer?: string;
  results?: TavilyResult[];
}

function unique(values: string[]) {
  return Array.from(
    new Map(
      values
        .map(cleanResearchText)
        .filter(Boolean)
        .map((value) => [normalizeComparable(value), value]),
    ).values(),
  );
}

function cleanResearchText(value: string) {
  return cleanContentStudioText(
    value
      .replace(/<[^>]+>/g, " ")
      .replace(/^\s{0,3}#{1,6}\s*/g, "")
      .replace(/^\s{0,3}[-*+]\s+/g, "")
      .replace(/^\s{0,3}\d+[.)]\s+/g, "")
      .replace(/#{1,6}\s*/g, "")
      .replace(/__(.*?)__/g, "$1")
      .replace(/\s*:\s*r\/[a-z0-9_]+.*$/i, "")
      .replace(/\s+/g, " "),
  );
}

function normalizeComparable(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^\w\s?]/g, "")
    .replace(/\b(an|the)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function resultLooksSalesHeavy(result: TavilyResult) {
  const joined =
    `${result.title ?? ""} ${result.url ?? ""} ${result.content ?? ""}`.toLowerCase();

  return /(collections?|cart|shop|buy|price|discount|under \d+|best sellers|new arrivals|your cart|add to cart)/.test(
    joined,
  );
}

function joinedResultText(results: TavilyResult[]) {
  return results
    .map((result) => `${result.title ?? ""} ${result.content ?? ""}`)
    .join(" ")
    .toLowerCase();
}

function isCleanQuestion(value: string) {
  const lower = value.toLowerCase();
  const startsLikeQuestion =
    /^(what|why|how|when|where|who|which|can|should|does|do|is|are|will|would)\b/.test(
      lower,
    );

  return (
    value.endsWith("?") &&
    value.length >= 8 &&
    value.length <= 140 &&
    value.includes(" ") &&
    startsLikeQuestion &&
    !/(why it'?s worth it|editor'?s tip|available sizes|customer review|feeling french)/i.test(
      value,
    ) &&
    !/[\\/]/.test(value) &&
    !/\b(http|www|\.com|\.net|\.org|utm_|ref=)\b/i.test(value)
  );
}

function extractHeadings(text: string) {
  const headings = [
    ...text.matchAll(/^\s{0,3}#{1,6}\s+(.+)$/gm),
    ...text.matchAll(/<h[23][^>]*>(.*?)<\/h[23]>/gim),
  ].map((match) => match[1]);

  return unique(headings).filter(isUsefulHeading).slice(0, 12);
}

function isUsefulHeading(value: string) {
  const lower = value.toLowerCase();

  return (
    value.length >= 8 &&
    value.length <= 90 &&
    !/[\\/]/.test(value) &&
    !/\b(http|www|\.com|\.net|\.org|utm_|ref=)\b/i.test(value) &&
    !/(trending search|related posts?|next post|previous post|skip to content|home|best sellers|new arrivals|your cart|privacy policy|terms|available sizes|customer review|editor'?s tip|why it'?s worth it|shop now)/i.test(
      lower,
    )
  );
}

function extractQuestions(text: string, keyword: string) {
  const matches = [
    ...text.matchAll(/(?:^|[\n\r.!])\s*([^?\n\r]{3,140}\?)/g),
  ].map((match) => match[1]);
  const questionLike = [
    ...matches,
    `What should readers know before searching for ${keyword}?`,
    `How does ${keyword} change on skin or in a collection?`,
    `What do most guides about ${keyword} leave out?`,
  ];

  return unique(questionLike).filter(isCleanQuestion).slice(0, 8);
}

function inferIntent(keyword: string, results: TavilyResult[]) {
  const joined = joinedResultText(results);
  const hasCommercial = /(best|top|review|reviewed|ranked|vs|buy|price|shop|under \d+|where to buy)/.test(
    joined,
  );
  const hasInformational = /(how|guide|what|why|meaning|explained|beginner|does|last|smell|notes|come from)/.test(
    joined,
  );
  const hasPerformance = /(longevity|lasts?|sillage|projection|skin chemistry|daily wear|occasion|season)/.test(
    joined,
  );

  if (hasCommercial && hasInformational) {
    return `Mixed intent: searchers want to understand "${keyword}", compare options, and decide whether it will suit their skin, taste, and wearing habits.`;
  }

  if (hasCommercial) {
    return `Commercial investigation: searchers want help choosing, comparing, or avoiding a bad purchase around "${keyword}".`;
  }

  if (hasInformational || hasPerformance) {
    return `Informational guidance: searchers want a clear explanation of "${keyword}" with enough detail to trust the answer.`;
  }

  return `Exploratory intent: searchers are trying to understand "${keyword}" and want a more confident point of view than a generic overview.`;
}

function inferGaps(results: TavilyResult[], keyword: string) {
  const joined = joinedResultText(results);
  const gaps = [
    `A sensory explanation of ${keyword} that goes beyond "woody, smoky, sweet."`,
    "A clearer link between search advice and how the fragrance behaves on real skin.",
    "A stronger editorial point of view than a product roundup or sales page.",
  ];

  if (!joined.includes("skin")) {
    gaps.push("Skin chemistry and context appear underdeveloped.");
  }
  if (!joined.includes("season")) {
    gaps.push("Seasonal and situational guidance could make the article more useful.");
  }
  if (!joined.includes("collection")) {
    gaps.push("Few competitors frame the topic through the reader's existing fragrance collection.");
  }

  return gaps.slice(0, 6);
}

function makeOutline(keyword: string, results: TavilyResult[]) {
  const joined = joinedResultText(results);
  const title = titleCase(keyword);
  const outline = [
    `What ${title} Actually Is`,
    `What ${title} Smells Like`,
  ];

  if (/(longevity|lasts?|sillage|projection)/.test(joined)) {
    outline.push(`Why ${title} Often Lasts So Long`);
  }

  if (/(skin|chemistry|daily wear|occasion|season)/.test(joined)) {
    outline.push(`How ${title} Changes on Skin and in Real Life`);
  }

  if (/(rose|saffron|vanilla|leather|amber|spice|smoky|sweet|woody|animalic|medicinal)/.test(joined)) {
    outline.push("The Pairings That Make Oud Feel Wearable");
  }

  if (/(best|top|beginner|review|ranked|buy)/.test(joined)) {
    outline.push(`How to Choose a ${title} Without Chasing a List`);
  }

  outline.push(
    "What Most Oud Guides Leave Out",
    "How Olfaire Readers Can Think About Oud Before Joining the Waitlist",
  );

  return unique(outline).slice(0, 8);
}

function makeSummary(keyword: string, data: TavilyResponse, results: TavilyResult[]) {
  const answer = cleanResearchText(data.answer ?? "");
  const usefulAnswer =
    answer &&
    answer.length >= 50 &&
    !/(our perfumes|shop|buy|cart|destination for authentic)/i.test(answer);

  if (usefulAnswer) {
    return answer;
  }

  const salesHeavyCount = results.filter(resultLooksSalesHeavy).length;
  const hasBestLists = results.some((result) =>
    /\b(best|top|ranked|reviewed)\b/i.test(
      `${result.title ?? ""} ${result.content ?? ""}`,
    ),
  );
  const hasGuideContent = results.some((result) =>
    /\b(what is|guide|beginner|smell|last|longevity|notes)\b/i.test(
      `${result.title ?? ""} ${result.content ?? ""}`,
    ),
  );

  if (hasBestLists && hasGuideContent) {
    return `The SERP for ${keyword} blends education with buying advice: readers want to know what oud smells like, why it lasts, which styles feel wearable, and how to avoid choosing an oud that feels too harsh or generic.`;
  }

  if (salesHeavyCount >= 3) {
    return `Many ranking pages for ${keyword} are product-led, which creates an opportunity for Olfaire to offer a cleaner, more sensory guide before asking readers to choose a scent.`;
  }

  return `Top-ranking pages cover ${keyword}, but the opportunity is to make the topic more specific, sensory, and useful for Olfaire readers.`;
}

function makeInternalLinks(keyword: string) {
  return getAllPosts()
    .filter((post) => {
      const haystack = `${post.title} ${post.category} ${post.excerpt}`.toLowerCase();
      return keyword
        .toLowerCase()
        .split(/\s+/)
        .some((part) => part.length > 3 && haystack.includes(part));
    })
    .slice(0, 4)
    .map((post) => ({
      title: post.title,
      slug: post.slug,
      reason: "Related by topic, category, or reader intent.",
    }));
}

export class TavilyResearchService implements ResearchService {
  async search(input: ContentStudioInput): Promise<ResearchResult> {
    const apiKey = process.env.TAVILY_API_KEY;

    if (!apiKey) {
      throw new Error("TAVILY_API_KEY is not configured.");
    }

    const focusKeyword = normalizeResearchKeyword(input.keyword);
    const query = `${focusKeyword} fragrance guide best longevity notes`;
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        search_depth: "advanced",
        include_answer: true,
        include_raw_content: true,
        max_results: 8,
      }),
    });

    if (!response.ok) {
      throw new Error(`Tavily research failed with status ${response.status}.`);
    }

    const data = (await response.json()) as TavilyResponse;
    const results = data.results ?? [];
    const rankedResults = [...results].sort((a, b) => {
      const aSales = resultLooksSalesHeavy(a) ? 1 : 0;
      const bSales = resultLooksSalesHeavy(b) ? 1 : 0;
      return aSales - bSales;
    });
    const rawText = results
      .map((result) => `${result.title ?? ""}\n${result.content ?? ""}\n${result.raw_content ?? ""}`)
      .join("\n\n");
    const competitorHeadings = extractHeadings(rawText);
    const commonQuestions = extractQuestions(rawText, focusKeyword);
    const searchIntent = inferIntent(focusKeyword, results);
    const contentGaps = inferGaps(results, focusKeyword);
    const suggestedAngle = `Write for ${input.audience || "fragrance-curious readers"} who want ${focusKeyword} explained through smell, wearability, longevity, and real collection decisions.`;
    const tension = `Most pages either define ${focusKeyword} broadly or turn it into a shopping list; Olfaire should help readers understand what oud will actually feel like on skin and in a wardrobe.`;
    const recommendedOutline = makeOutline(focusKeyword, results);

    return {
      keyword: focusKeyword,
      summary: makeSummary(focusKeyword, data, results),
      searchIntent,
      suggestedAngle,
      tension,
      competitorHeadings,
      commonQuestions,
      contentGaps,
      recommendedOutline,
      seoTitle: `${input.title || titleCase(focusKeyword)} | Olfaire`,
      metaDescription: `A clear, sensory guide to ${focusKeyword} for fragrance readers who want better advice than generic search results.`,
      suggestedSlug: slugify(input.title || input.keyword),
      internalLinks: makeInternalLinks(focusKeyword),
      topResults: rankedResults.slice(0, 8).map((result) => ({
        title: result.title ?? "Untitled result",
        url: result.url ?? "",
        snippet: result.content ?? "",
      })),
    };
  }
}

export function getResearchService(): ResearchService {
  return new TavilyResearchService();
}

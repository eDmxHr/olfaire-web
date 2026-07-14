import "server-only";

import { getAllPosts } from "@/lib/mdx";
import { synthesizeResearch } from "./research-synthesis";
import { normalizeResearchKeyword, slugify } from "./utils";
import type { ContentStudioInput, ResearchResult } from "./types";

interface ResearchService {
  search(input: ContentStudioInput): Promise<ResearchResult>;
}

interface TavilyResult {
  title?: string;
  url?: string;
  content?: string;
}

interface TavilyResponse {
  answer?: string;
  results?: TavilyResult[];
}

function resultLooksSalesHeavy(result: TavilyResult) {
  const joined =
    `${result.title ?? ""} ${result.url ?? ""} ${result.content ?? ""}`.toLowerCase();

  return /(collections?|cart|shop|buy|price|discount|under \d+|best sellers|new arrivals|your cart|add to cart)/.test(
    joined,
  );
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
        max_results: 8,
      }),
      signal: AbortSignal.timeout(15000),
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

    const topResults = rankedResults.slice(0, 8).map((result) => ({
      title: result.title ?? "Untitled result",
      url: result.url ?? "",
      snippet: result.content ?? "",
    }));

    // Claude synthesis is the only path; a failure propagates so the route
    // returns a clean error (no low-quality heuristic fallback).
    const synthesized = await synthesizeResearch(
      input,
      results.map((result) => ({
        title: result.title,
        url: result.url,
        content: result.content,
      })),
      data.answer ?? "",
    );

    return {
      keyword: focusKeyword,
      ...synthesized,
      suggestedSlug: slugify(input.title || input.keyword),
      internalLinks: makeInternalLinks(focusKeyword),
      topResults,
    };
  }
}

export function getResearchService(): ResearchService {
  return new TavilyResearchService();
}

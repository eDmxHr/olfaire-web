import "server-only";

import crypto from "crypto";
import fs from "fs/promises";
import os from "os";
import path from "path";
import { getAllPosts } from "@/lib/mdx";
import { getFragranceTrendSignals } from "./google-trends";
import { getSearchConsoleOpportunities } from "./search-console";
import { synthesizeTopicIdeas } from "./topic-synthesis";

type TopicIdeaSource = "search_console" | "tavily" | "reddit" | "fallback";

export type SearchIntent =
  | "informational"
  | "commercial"
  | "comparison"
  | "transactional";

export type TrafficLevel = "low" | "medium" | "high";

export interface TopicIdea {
  keyword: string;
  angle: string;
  source: TopicIdeaSource;
  score: number;
  searchIntent?: SearchIntent;
  trendRationale?: string;
  appAngle?: string;
  trafficPotential?: TrafficLevel;
  difficulty?: TrafficLevel;
  estimated?: boolean;
}

interface TavilyTopicCache {
  generatedAt: string;
  ideas: TopicIdea[];
  queries: string[];
}

// Serverless filesystems (Vercel) are read-only apart from the temp dir, so
// cache there instead of the project root. /tmp survives warm invocations,
// which is enough for a 24h TTL to still pay off.
const CACHE_ROOT = process.env.VERCEL
  ? path.join(os.tmpdir(), "content-studio", "cache")
  : path.join(process.cwd(), ".content-studio", "cache");
const TAVILY_TOPIC_CACHE_TTL_MS = 1000 * 60 * 60 * 24;
const TAVILY_TOPIC_CACHE_VERSION = "v4";

const fallbackIdeas: TopicIdea[] = [
  {
    keyword: "perfume layering mistakes",
    angle: "Help readers understand why combinations fail on skin.",
    source: "fallback",
    score: 82,
  },
  {
    keyword: "how to store perfume",
    angle: "Turn storage advice into a practical shelf-care guide.",
    source: "fallback",
    score: 78,
  },
  {
    keyword: "skin chemistry perfume",
    angle: "Explain why the same scent behaves differently person to person.",
    source: "fallback",
    score: 76,
  },
  {
    keyword: "oud fragrance guide",
    angle: "Make oud less mythical and more useful for new collectors.",
    source: "fallback",
    score: 74,
  },
  {
    keyword: "perfume notes explained",
    angle: "Explain notes as structure, not shopping vocabulary.",
    source: "fallback",
    score: 72,
  },
  {
    keyword: "seasonal fragrance rotation",
    angle: "Frame seasons as behavior, temperature, and mood rather than rules.",
    source: "fallback",
    score: 70,
  },
  {
    keyword: "why perfume smells different on skin",
    angle: "Connect skin, heat, humidity, and expectation in plain language.",
    source: "fallback",
    score: 68,
  },
  {
    keyword: "how to choose a signature scent",
    angle: "Push beyond identity cliches into repeatable wearing patterns.",
    source: "fallback",
    score: 66,
  },
];

const topicDiscoveryQueries = [
  "perfume fragrance questions guide collectors beginners",
  "fragrance layering skin chemistry storage perfume questions",
  "oud perfume notes longevity sillage guide questions",
  "perfume notes longevity sillage seasonal fragrance guide",
];

const newsDiscoveryQueries = [
  "new fragrance releases 2026 perfume launches",
  "trending perfumes viral tiktok fragrance",
  "fragrance industry news niche perfume trends",
];

const redditDiscoveryQueries = [
  "site:reddit.com/r/fragrance perfume layering question",
  "site:reddit.com/r/fragrance why does perfume not last",
  "site:reddit.com/r/Perfumes skin chemistry perfume question",
  "site:reddit.com/r/fragrance oud perfume beginner question",
  "site:reddit.com/r/Colognes signature scent question",
];

function hasExistingCoverage(keyword: string) {
  const terms = keyword
    .toLowerCase()
    .split(/\s+/)
    .filter((term) => term.length > 3);

  return getAllPosts().some((post) => {
    const haystack = `${post.title} ${post.slug} ${post.excerpt}`.toLowerCase();
    return terms.some((term) => haystack.includes(term));
  });
}

function normalizeKey(value: string) {
  return value.toLowerCase().replace(/[^\w\s?]/g, "").replace(/\s+/g, " ").trim();
}

function addIdea(ideas: Map<string, TopicIdea>, idea: TopicIdea) {
  const key = normalizeKey(idea.keyword);
  const existing = ideas.get(key);

  if (!existing || idea.score > existing.score) {
    ideas.set(key, idea);
  }
}

function cacheQueries() {
  return [
    ...topicDiscoveryQueries,
    ...newsDiscoveryQueries,
    ...redditDiscoveryQueries,
  ];
}

function tavilyTopicCachePath() {
  const hash = crypto
    .createHash("sha256")
    .update(`${TAVILY_TOPIC_CACHE_VERSION}:${cacheQueries().join("|")}`)
    .digest("hex")
    .slice(0, 16);

  return path.join(CACHE_ROOT, `tavily-topic-ideas-${hash}.json`);
}

async function readTavilyTopicCache() {
  try {
    const raw = await fs.readFile(tavilyTopicCachePath(), "utf-8");
    const cache = JSON.parse(raw) as TavilyTopicCache;
    const generatedAt = new Date(cache.generatedAt).getTime();

    if (
      Number.isFinite(generatedAt) &&
      Date.now() - generatedAt < TAVILY_TOPIC_CACHE_TTL_MS &&
      Array.isArray(cache.ideas)
    ) {
      return cache.ideas;
    }
  } catch {
    return null;
  }

  return null;
}

async function writeTavilyTopicCache(ideas: TopicIdea[]) {
  // Caching is best-effort: a write failure (read-only FS, full disk) must
  // never discard the ideas we just paid to synthesize.
  try {
    await fs.mkdir(CACHE_ROOT, { recursive: true });
    await fs.writeFile(
      tavilyTopicCachePath(),
      `${JSON.stringify(
        {
          generatedAt: new Date().toISOString(),
          ideas,
          queries: cacheQueries(),
        } satisfies TavilyTopicCache,
        null,
        2,
      )}\n`,
    );
  } catch {
    // Ignore — the ideas are still returned to the caller.
  }
}

interface RawTavilyResult {
  title?: string;
  url?: string;
  content?: string;
}

interface RawTavilyResponse {
  results?: RawTavilyResult[];
}

async function fetchRawTavily(
  queries: string[],
  apiKey: string,
  options: { topic?: "general" | "news"; days?: number } = {},
): Promise<RawTavilyResult[]> {
  const responses = await Promise.allSettled(
    queries.map(async (query) => {
      const response = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: apiKey,
          query,
          search_depth: "advanced",
          include_answer: false,
          max_results: 6,
          topic: options.topic ?? "general",
          ...(options.days ? { days: options.days } : {}),
        }),
        signal: AbortSignal.timeout(15000),
      });

      if (!response.ok) {
        throw new Error("Topic discovery failed.");
      }

      return (await response.json()) as RawTavilyResponse;
    }),
  );

  return responses.flatMap((response) =>
    response.status === "fulfilled" ? response.value.results ?? [] : [],
  );
}

async function getSynthesizedTopicIdeas(
  apiKey: string,
  searchConsoleQueries: string[],
) {
  const [tavilyGeneral, tavilyNews, reddit, trends] = await Promise.all([
    fetchRawTavily(topicDiscoveryQueries, apiKey),
    fetchRawTavily(newsDiscoveryQueries, apiKey, { topic: "news", days: 14 }),
    fetchRawTavily(redditDiscoveryQueries, apiKey),
    getFragranceTrendSignals().catch(() => ({
      risingQueries: [],
      interest: {},
    })),
  ]);

  const existingTitles = getAllPosts().map((post) => post.title);

  return synthesizeTopicIdeas({
    tavilyGeneral,
    tavilyNews,
    reddit,
    trends,
    searchConsoleQueries,
    existingTitles,
  });
}

async function getTavilyTopicIdeas(searchConsoleQueries: string[]) {
  const cachedIdeas = await readTavilyTopicCache();

  if (cachedIdeas) {
    return cachedIdeas;
  }

  const apiKey = process.env.TAVILY_API_KEY;

  if (!apiKey) {
    return [];
  }

  // Synthesis is the only path. On any failure (missing ANTHROPIC_API_KEY,
  // API error, malformed output) return nothing so getTopicIdeas falls back to
  // the curated fallbackIdeas — we don't cache an empty result.
  const ideas = await getSynthesizedTopicIdeas(apiKey, searchConsoleQueries);
  await writeTavilyTopicCache(ideas);
  return ideas;
}

export async function getTopicIdeas() {
  const ideas = new Map<string, TopicIdea>();
  const searchConsoleQueries: string[] = [];

  try {
    const searchConsole = await getSearchConsoleOpportunities();
    searchConsoleQueries.push(
      ...searchConsole.opportunities.map((item) => item.query),
      ...searchConsole.topQueries.map((item) => item.query),
    );
    const searchIdeas = [
      ...searchConsole.opportunities.map((item) => ({
        keyword: item.query,
        angle: item.reason,
        source: "search_console" as const,
        score: item.impressions + Math.max(0, 30 - item.position),
      })),
      ...searchConsole.topQueries.map((item) => ({
        keyword: item.query,
        angle: "Search Console is already showing Olfaire for this query.",
        source: "search_console" as const,
        score: item.impressions + item.clicks * 10,
      })),
    ];

    for (const idea of searchIdeas) {
      if (!hasExistingCoverage(idea.keyword)) {
        addIdea(ideas, idea);
      }
    }
  } catch {
    // Search Console is optional; Tavily and fallback ideas keep the panel useful.
  }

  try {
    for (const idea of await getTavilyTopicIdeas(searchConsoleQueries)) {
      addIdea(ideas, idea);
    }
  } catch {
    // Live topic discovery is optional because research still runs per keyword.
  }

  if (!ideas.size) {
    for (const idea of fallbackIdeas) {
      if (!hasExistingCoverage(idea.keyword)) {
        addIdea(ideas, idea);
      }
    }
  }

  return Array.from(ideas.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}

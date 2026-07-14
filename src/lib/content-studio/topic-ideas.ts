import "server-only";

import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import { getAllPosts } from "@/lib/mdx";
import { getSearchConsoleOpportunities } from "./search-console";
import { normalizeResearchKeyword } from "./utils";

type TopicIdeaSource = "search_console" | "tavily" | "reddit" | "fallback";

interface DiscoveryConfig {
  source: Extract<TopicIdeaSource, "tavily" | "reddit">;
  queries: string[];
  baseScore: number;
  queryPenalty: number;
  angle: (keyword: string) => string;
  errorMessage: string;
}

export interface TopicIdea {
  keyword: string;
  angle: string;
  source: TopicIdeaSource;
  score: number;
}

interface TavilyTopicResult {
  title?: string;
  url?: string;
  content?: string;
}

interface TavilyTopicResponse {
  results?: TavilyTopicResult[];
}

interface TavilyTopicCache {
  generatedAt: string;
  ideas: TopicIdea[];
  queries: string[];
}

const CACHE_ROOT = path.join(process.cwd(), ".content-studio", "cache");
const TAVILY_TOPIC_CACHE_TTL_MS = 1000 * 60 * 60 * 24;
const TAVILY_TOPIC_CACHE_VERSION = "v3";

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

const redditDiscoveryQueries = [
  "site:reddit.com/r/fragrance perfume layering question",
  "site:reddit.com/r/fragrance why does perfume not last",
  "site:reddit.com/r/Perfumes skin chemistry perfume question",
  "site:reddit.com/r/fragrance oud perfume beginner question",
  "site:reddit.com/r/Colognes signature scent question",
];

const discoveryConfigs: DiscoveryConfig[] = [
  {
    source: "tavily",
    queries: topicDiscoveryQueries,
    baseScore: 95,
    queryPenalty: 5,
    angle: makeTavilyAngle,
    errorMessage: "Topic discovery failed.",
  },
  {
    source: "reddit",
    queries: redditDiscoveryQueries,
    baseScore: 92,
    queryPenalty: 4,
    angle: makeRedditAngle,
    errorMessage: "Reddit topic discovery failed.",
  },
];

const fragranceTopicPattern =
  /\b(perfume|fragrance|scent|cologne|parfum|oud|attar|musk|amber|rose|vanilla|notes?|accord|layering|sillage|projection|longevity|skin chemistry|storage|seasonal|signature scent|collector|bottle)\b/i;

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

function cleanTopicText(value: string) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/\[(.*?)\]\([^)]+\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*/g, "")
    .replace(/^\s{0,3}#{1,6}\s*/gm, "")
    .replace(/^\s{0,3}[-*+]\s+/gm, "")
    .replace(/^\s{0,3}\d+[.)]\s+/gm, "")
    .replace(/\s*:\s*r\/[a-z0-9_]+.*$/i, "")
    .replace(/\s+-\s+Reddit.*$/i, "")
    .replace(/\s+-\s+(reddit|fragrantica|byrdie|vogue|gq|esquire|allure).*$/i, "")
    .replace(/\s+\|\s+.*$/g, "")
    .replace(/\s+/g, " ")
    .replace(/^["'“”‘’\s:,-]+/, "")
    .replace(/["'“”‘’\s:,-]+$/, "")
    .trim();
}

function isUsefulTopic(value: string) {
  const lower = value.toLowerCase();

  return (
    value.length >= 12 &&
    value.length <= 95 &&
    value.includes(" ") &&
    fragranceTopicPattern.test(value) &&
    !/[\\/]/.test(value) &&
    !/\b(http|www|\.com|\.net|\.org|utm_|ref=)\b/i.test(value) &&
    !/(privacy policy|terms of service|login|sign up|coupon|discount)/i.test(
      lower,
    )
  );
}

function normalizeKey(value: string) {
  return value.toLowerCase().replace(/[^\w\s?]/g, "").replace(/\s+/g, " ").trim();
}

function extractTopicCandidates(result: TavilyTopicResult) {
  const title = cleanTopicText(result.title ?? "");
  const content = cleanTopicText(result.content ?? "");
  const sentences = content
    .split(/(?<=[.!?])\s+/)
    .map(cleanTopicText)
    .filter((item) => item.length <= 110);

  return [title, ...sentences]
    .map((candidate) => {
      if (candidate.endsWith(".")) {
        return candidate.slice(0, -1);
      }
      return candidate;
    })
    .filter(isUsefulTopic)
    .map(normalizeResearchKeyword)
    .filter(isUsefulTopic);
}

function makeTavilyAngle(keyword: string) {
  if (/\b(layer|layering)\b/i.test(keyword)) {
    return "Turn layering advice into practical decisions about contrast, texture, and skin behavior.";
  }

  if (/\b(skin|chemistry|longevity|projection|sillage)\b/i.test(keyword)) {
    return "Explain the gap between search advice and what actually happens when fragrance is worn.";
  }

  if (/\b(oud|musk|amber|rose|vanilla|notes?|accord)\b/i.test(keyword)) {
    return "Make the material or note feel sensory, useful, and less trapped in generic vocabulary.";
  }

  if (/\b(store|storage|bottle|collection|collector)\b/i.test(keyword)) {
    return "Frame the topic around how a real fragrance collection is used, protected, and understood.";
  }

  return "Use the live search pattern as a starting point, then add Olfaire's more sensory, collector-aware point of view.";
}

function makeRedditAngle(keyword: string) {
  if (/\b(last|longevity|projection|sillage|disappear)\b/i.test(keyword)) {
    return "Answer the wearing problem behind the question: why scent performance changes across skin, weather, and expectation.";
  }

  if (/\b(layer|layering)\b/i.test(keyword)) {
    return "Turn a recurring community question into a clear guide for layering without flattening the fragrances.";
  }

  if (/\b(oud|musk|amber|rose|vanilla|notes?|accord)\b/i.test(keyword)) {
    return "Use the community question as a way to make the note more sensory and less intimidating.";
  }

  if (/\b(signature|choose|beginner|blind buy)\b/i.test(keyword)) {
    return "Translate a common buying anxiety into a practical, taste-led decision framework.";
  }

  return "Use the Reddit signal as a human question to answer with more taste, context, and restraint than a generic guide.";
}

function addIdea(ideas: Map<string, TopicIdea>, idea: TopicIdea) {
  const key = normalizeKey(idea.keyword);
  const existing = ideas.get(key);

  if (!existing || idea.score > existing.score) {
    ideas.set(key, idea);
  }
}

function cacheQueries() {
  return discoveryConfigs.flatMap((config) => config.queries);
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
}

async function fetchDiscoveredTopicIdeas(config: DiscoveryConfig, apiKey: string) {
  const responses = await Promise.allSettled(
    config.queries.map(async (query) => {
      const response = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: apiKey,
          query,
          search_depth: "advanced",
          include_answer: false,
          max_results: 6,
        }),
      });

      if (!response.ok) {
        throw new Error(config.errorMessage);
      }

      return (await response.json()) as TavilyTopicResponse;
    }),
  );

  const ideas = new Map<string, TopicIdea>();

  responses.forEach((response, queryIndex) => {
    if (response.status !== "fulfilled") return;

    response.value.results?.forEach((result, resultIndex) => {
      extractTopicCandidates(result).forEach((keyword, candidateIndex) => {
        if (hasExistingCoverage(keyword)) return;

        addIdea(ideas, {
          keyword,
          angle: config.angle(keyword),
          source: config.source,
          score:
            config.baseScore -
            queryIndex * config.queryPenalty -
            resultIndex * 3 -
            candidateIndex,
        });
      });
    });
  });

  return Array.from(ideas.values());
}

async function getTavilyTopicIdeas() {
  const cachedIdeas = await readTavilyTopicCache();

  if (cachedIdeas) {
    return cachedIdeas;
  }

  const apiKey = process.env.TAVILY_API_KEY;

  if (!apiKey) {
    return [];
  }

  const ideas = (
    await Promise.all(
      discoveryConfigs.map((config) =>
        fetchDiscoveredTopicIdeas(config, apiKey),
      ),
    )
  ).flat();

  await writeTavilyTopicCache(ideas);
  return ideas;
}

export async function getTopicIdeas() {
  const ideas = new Map<string, TopicIdea>();

  try {
    const searchConsole = await getSearchConsoleOpportunities();
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
    for (const idea of await getTavilyTopicIdeas()) {
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

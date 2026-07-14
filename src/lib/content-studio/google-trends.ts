import "server-only";

import googleTrends from "google-trends-api";

export interface FragranceTrendSignals {
  risingQueries: string[];
  interest: Record<string, number>;
}

const SEED_KEYWORDS = [
  "perfume",
  "fragrance",
  "oud",
  "niche fragrance",
  "perfume dupes",
  "best perfume",
];

const TRENDS_TIMEOUT_MS = 12000;
const RISING_QUERIES_LIMIT = 25;

interface RankedKeyword {
  query?: string;
  value?: number | string;
}

interface RankedList {
  rankedKeyword?: RankedKeyword[];
}

interface RelatedQueriesResponse {
  default?: {
    rankedList?: RankedList[];
  };
}

interface TimelinePoint {
  value?: number[];
}

interface InterestOverTimeResponse {
  default?: {
    timelineData?: TimelinePoint[];
  };
}

function withTimeout<T>(promise: Promise<T>): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Google Trends timed out.")), TRENDS_TIMEOUT_MS),
    ),
  ]);
}

function parseRisingQueries(raw: string): string[] {
  const parsed = JSON.parse(raw) as RelatedQueriesResponse;
  // rankedList[1] is the "rising" list; [0] is "top".
  const rising = parsed.default?.rankedList?.[1]?.rankedKeyword ?? [];
  return rising
    .map((item) => item.query?.trim())
    .filter((query): query is string => Boolean(query));
}

function parseAverageInterest(raw: string): number {
  const parsed = JSON.parse(raw) as InterestOverTimeResponse;
  const points = parsed.default?.timelineData ?? [];
  const values = points
    .map((point) => point.value?.[0])
    .filter((value): value is number => typeof value === "number");
  if (!values.length) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

export async function getFragranceTrendSignals(): Promise<FragranceTrendSignals> {
  const risingResults = await Promise.allSettled(
    SEED_KEYWORDS.map((keyword) =>
      withTimeout(googleTrends.relatedQueries({ keyword, geo: "US" })),
    ),
  );

  const risingQueries = new Set<string>();
  risingResults.forEach((result) => {
    if (result.status !== "fulfilled") return;
    try {
      for (const query of parseRisingQueries(result.value)) {
        risingQueries.add(query);
      }
    } catch {
      // Ignore malformed payloads for a single seed.
    }
  });

  const interest: Record<string, number> = {};
  const interestResults = await Promise.allSettled(
    SEED_KEYWORDS.map((keyword) =>
      withTimeout(
        googleTrends.interestOverTime({
          keyword,
          geo: "US",
          startTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90),
        }),
      ),
    ),
  );

  interestResults.forEach((result, index) => {
    if (result.status !== "fulfilled") return;
    try {
      interest[SEED_KEYWORDS[index]] = parseAverageInterest(result.value);
    } catch {
      // Ignore malformed payloads for a single seed.
    }
  });

  return {
    risingQueries: Array.from(risingQueries).slice(0, RISING_QUERIES_LIMIT),
    interest,
  };
}

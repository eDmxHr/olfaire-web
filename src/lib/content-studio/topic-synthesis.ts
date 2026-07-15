import "server-only";

import Anthropic from "@anthropic-ai/sdk";
import type { FragranceTrendSignals } from "./google-trends";
import type {
  SearchIntent,
  TopicIdea,
  TrafficLevel,
} from "./topic-ideas";

interface RawResult {
  title?: string;
  url?: string;
  content?: string;
}

export interface TopicSignals {
  tavilyNews: RawResult[];
  tavilyGeneral: RawResult[];
  reddit: RawResult[];
  trends: FragranceTrendSignals;
  searchConsoleQueries: string[];
  existingTitles: string[];
}

interface SynthesizedIdea {
  keyword: string;
  searchIntent: SearchIntent;
  angle: string;
  trendRationale: string;
  appAngle: string;
  trafficPotential: TrafficLevel;
  difficulty: TrafficLevel;
}

const MODEL = "claude-haiku-4-5";

const IDEA_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["ideas"],
  properties: {
    ideas: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "keyword",
          "searchIntent",
          "angle",
          "trendRationale",
          "appAngle",
          "trafficPotential",
          "difficulty",
        ],
        properties: {
          keyword: { type: "string" },
          searchIntent: {
            type: "string",
            enum: ["informational", "commercial", "comparison", "transactional"],
          },
          angle: { type: "string" },
          trendRationale: { type: "string" },
          appAngle: { type: "string" },
          trafficPotential: { type: "string", enum: ["low", "medium", "high"] },
          difficulty: { type: "string", enum: ["low", "medium", "high"] },
        },
      },
    },
  },
} as const;

const SYSTEM_PROMPT = `You are the SEO content strategist for Olfaire, a fragrance discovery brand with an app launching soon.

Goal: propose blog article ideas that (1) target trending, high-organic-traffic fragrance search demand, (2) are realistic to rank for a brand-new site, and (3) naturally lead the reader toward using the Olfaire app.

Draw from three content types, and mix across all three rather than leaning on one:
- Trending fragrance/industry news: new releases, flankers (a "flanker" is a follow-up variant riding on a hit original — e.g. an EDP flanker of a popular EDT), brand collaborations, celebrity launches, viral fragrance moments.
- Practical buying guides: e.g. "is this flanker worth buying", gift guides, starter-collection guides, designer-vs-niche value guides.
- Evergreen fragrance education: layering, longevity, skin chemistry, storage, seasonal wear.

Olfaire's editorial voice is sensory, literary, concise, collector-aware, and useful — never generic listicle filler, never copied from competitors.

Rules for each idea:
- "keyword": a short, natural search phrase people would actually type (NOT a full sentence, NOT a snippet of prose). 2-6 words.
- "searchIntent": the dominant intent behind that search.
- "angle": Olfaire's distinctive take on the topic, one sentence.
- "trendRationale": why this is timely NOW, grounded in the rising queries / recent news provided. If no strong trend signal, say it reflects steady evergreen demand.
- "appAngle": one concrete way the finished article hooks the reader toward the Olfaire app.
- "trafficPotential" and "difficulty": your best estimate. Favor high-traffic, low-difficulty topics.

DIVERSITY (important):
- The 10 ideas must span genuinely different territory. At most ONE idea may centre on any single fragrance note or material (oud, vanilla, rose, musk...). Do not let one material dominate the list.
- Mix the formats: how-to, explainer, comparison, seasonal, collection-building, buying-decision.
- The Search Console queries reflect the handful of terms the site happens to rank for today — they are context for spotting adjacent gaps, NOT a template. Do not simply return variations of them.

Return ~10 ideas. Do not repeat topics already covered by the site's existing articles. Every idea must be distinct.`;

function buildUserPrompt(signals: TopicSignals): string {
  const section = (label: string, lines: string[]) =>
    lines.length ? `${label}:\n${lines.map((l) => `- ${l}`).join("\n")}` : "";

  const results = (label: string, items: RawResult[]) =>
    section(
      label,
      items
        .slice(0, 12)
        .map((item) =>
          [item.title, item.content?.slice(0, 200)].filter(Boolean).join(" — "),
        )
        .filter(Boolean),
    );

  const interestLines = Object.entries(signals.trends.interest).map(
    ([keyword, value]) => `${keyword}: ${value}/100 avg interest (90d)`,
  );

  return [
    section("Google Trends rising fragrance queries (trend signal)", signals.trends.risingQueries),
    section("Google Trends relative interest", interestLines),
    results("Recent fragrance news (Tavily)", signals.tavilyNews),
    results("General fragrance discussion (Tavily)", signals.tavilyGeneral),
    results("Reddit enthusiast discussion", signals.reddit),
    section(
      "Queries Olfaire already gets impressions for (Search Console) — context only, do NOT over-index on these",
      signals.searchConsoleQueries,
    ),
    section("Existing Olfaire articles — DO NOT duplicate these", signals.existingTitles),
    "\nReturn the JSON object of ideas.",
  ]
    .filter(Boolean)
    .join("\n\n");
}

const TRAFFIC_SCORE: Record<TrafficLevel, number> = { low: 1, medium: 2, high: 3 };

function scoreIdea(idea: SynthesizedIdea): number {
  // Reward traffic potential, penalize difficulty. Base 70 keeps synthesized
  // ideas above the heuristic fallback range.
  return (
    70 + TRAFFIC_SCORE[idea.trafficPotential] * 8 - TRAFFIC_SCORE[idea.difficulty] * 4
  );
}

export async function synthesizeTopicIdeas(
  signals: TopicSignals,
): Promise<TopicIdea[]> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not configured.");
  }

  const client = new Anthropic();
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 2000,
    system: SYSTEM_PROMPT,
    output_config: { format: { type: "json_schema", schema: IDEA_SCHEMA } },
    messages: [{ role: "user", content: buildUserPrompt(signals) }],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Topic synthesis returned no text.");
  }

  const parsed = JSON.parse(textBlock.text) as { ideas?: SynthesizedIdea[] };
  const ideas = parsed.ideas ?? [];
  if (!ideas.length) {
    throw new Error("Topic synthesis returned no ideas.");
  }

  // Traffic/difficulty are Claude estimates unless the keyword matches a Trends
  // rising query (real signal).
  const risingSet = new Set(
    signals.trends.risingQueries.map((q) => q.toLowerCase()),
  );

  return ideas.map((idea) => ({
    keyword: idea.keyword,
    angle: idea.angle,
    source: "tavily" as const,
    score: scoreIdea(idea),
    searchIntent: idea.searchIntent,
    trendRationale: idea.trendRationale,
    appAngle: idea.appAngle,
    trafficPotential: idea.trafficPotential,
    difficulty: idea.difficulty,
    estimated: !risingSet.has(idea.keyword.toLowerCase()),
  }));
}

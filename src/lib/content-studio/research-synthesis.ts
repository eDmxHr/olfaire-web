import "server-only";

import Anthropic from "@anthropic-ai/sdk";
import type { ContentStudioInput, ResearchResult } from "./types";

interface RawResult {
  title?: string;
  url?: string;
  content?: string;
}

type SynthesizedResearch = Pick<
  ResearchResult,
  | "summary"
  | "searchIntent"
  | "suggestedAngle"
  | "tension"
  | "competitorHeadings"
  | "commonQuestions"
  | "contentGaps"
  | "recommendedOutline"
  | "seoTitle"
  | "metaDescription"
>;

const MODEL = "claude-haiku-4-5";

const stringArray = {
  type: "array",
  items: { type: "string" },
} as const;

const RESEARCH_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "summary",
    "searchIntent",
    "suggestedAngle",
    "tension",
    "competitorHeadings",
    "commonQuestions",
    "contentGaps",
    "recommendedOutline",
    "seoTitle",
    "metaDescription",
  ],
  properties: {
    summary: { type: "string" },
    searchIntent: { type: "string" },
    suggestedAngle: { type: "string" },
    tension: { type: "string" },
    competitorHeadings: stringArray,
    commonQuestions: stringArray,
    contentGaps: stringArray,
    recommendedOutline: stringArray,
    seoTitle: { type: "string" },
    metaDescription: { type: "string" },
  },
} as const;

const SYSTEM_PROMPT = `You are the SEO and editorial research analyst for Olfaire, a fragrance discovery brand with an app launching soon.

Given a target article and the current top-ranking search results, produce a research brief that helps write an article BETTER than what currently ranks — one that earns organic search traffic and gently leads readers toward the Olfaire app.

Olfaire's voice is sensory, literary, concise, collector-aware, and genuinely useful — never generic listicle filler, never copied from competitors.

Ground every field in the ACTUAL target keyword and the provided results — never default to unrelated notes or materials. Produce:
- summary: what the SERP currently offers and where the opportunity is.
- searchIntent: the dominant intent behind this specific query.
- suggestedAngle: Olfaire's distinctive take.
- tension: the core gap/tension a great article would resolve (specific to THIS keyword).
- competitorHeadings: real, cleaned subtopics competitors cover (proper phrases, NOT raw sentence fragments).
- commonQuestions: genuine questions searchers ask.
- contentGaps: what ranking pages miss that Olfaire can own.
- recommendedOutline: H2-style section titles for the article.
- seoTitle and metaDescription: search-optimized, natural, about this keyword.`;

function buildUserPrompt(
  input: ContentStudioInput,
  results: RawResult[],
  answer: string,
): string {
  const brief = [
    `Article title: ${input.title || "(none yet)"}`,
    `Target keyword: ${input.keyword}`,
    `Category: ${input.category}`,
    `Audience: ${input.audience}`,
    input.notes ? `Editorial notes: ${input.notes}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const resultLines = results
    .slice(0, 8)
    .map((result, index) =>
      [
        `${index + 1}. ${result.title ?? "Untitled"}`,
        result.url ? `   ${result.url}` : "",
        result.content ? `   ${result.content.slice(0, 300)}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    )
    .join("\n");

  return [
    "TARGET ARTICLE:",
    brief,
    answer ? `\nSearch engine answer:\n${answer}` : "",
    "\nTOP RANKING RESULTS:",
    resultLines,
    "\nReturn the JSON research brief.",
  ]
    .filter(Boolean)
    .join("\n");
}

export async function synthesizeResearch(
  input: ContentStudioInput,
  results: RawResult[],
  answer: string,
): Promise<SynthesizedResearch> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not configured.");
  }

  const client = new Anthropic();
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 2000,
    system: SYSTEM_PROMPT,
    output_config: { format: { type: "json_schema", schema: RESEARCH_SCHEMA } },
    messages: [{ role: "user", content: buildUserPrompt(input, results, answer) }],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Research synthesis returned no text.");
  }

  return JSON.parse(textBlock.text) as SynthesizedResearch;
}

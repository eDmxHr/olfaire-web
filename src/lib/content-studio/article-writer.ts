import "server-only";

import Anthropic from "@anthropic-ai/sdk";
import { compile } from "@mdx-js/mdx";
import type { ContentDraft } from "./types";
import { estimateReadTime } from "./utils";

const MODEL = "claude-sonnet-5";

const SYSTEM_PROMPT = `You are the editorial writer for Olfaire, a fragrance discovery brand with an app launching soon.

Write a complete, publishable blog article. Voice: sensory, literary, concise, and genuinely useful — the register of a thoughtful essay, never generic listicle filler, never copied from competitors, never AI-slop hedging.

OUTPUT FORMAT — strict MDX rules:
- Output ONLY the article body as MDX. No frontmatter, no code fences, no preamble.
- Do NOT include an H1 (the title is rendered from frontmatter). Start with an opening paragraph.
- Use "## " for section headings and "### " for sub-sections.
- Use Markdown for everything: **bold**, _italic_, "- " / "1. " lists, "> " blockquotes.
- For at most TWO short reflective asides, you may use <LumiNote>...</LumiNote> with plain prose inside.
- NEVER emit raw HTML such as <div>, <p>, <span>, <br>, or inline styles. Only Markdown and <LumiNote>.

CONTENT:
- Naturally target the keyword for SEO — in the opening, a heading, and throughout — without keyword stuffing.
- Follow the recommended outline, answer the common questions, and fill the content gaps provided.
- 800–1400 words, tightly edited.
- End with a soft, non-salesy tie to Olfaire and its upcoming app / waitlist that follows naturally from the piece.`;

function buildUserPrompt(draft: ContentDraft): string {
  const { input, research } = draft;
  const lines = [
    `Title: ${input.title}`,
    `Target keyword: ${input.keyword}`,
    `Category: ${input.category}`,
    `Audience: ${input.audience}`,
    input.notes ? `Editorial notes: ${input.notes}` : "",
  ];

  if (research) {
    lines.push(
      "",
      `Search intent: ${research.searchIntent}`,
      `Angle: ${research.suggestedAngle}`,
      `Tension to resolve: ${research.tension}`,
    );
    if (research.recommendedOutline?.length) {
      lines.push(
        `Recommended outline:\n${research.recommendedOutline.map((h) => `- ${h}`).join("\n")}`,
      );
    }
    if (research.commonQuestions?.length) {
      lines.push(
        `Questions to answer:\n${research.commonQuestions.map((q) => `- ${q}`).join("\n")}`,
      );
    }
    if (research.contentGaps?.length) {
      lines.push(
        `Content gaps to fill:\n${research.contentGaps.map((g) => `- ${g}`).join("\n")}`,
      );
    }
  }

  if (draft.generatorBrief) {
    lines.push("", `Generator brief:\n${draft.generatorBrief}`);
  }

  lines.push("", "Write the article body now.");
  return lines.filter(Boolean).join("\n");
}

function stripCodeFences(text: string): string {
  const trimmed = text.trim();
  const fenced = trimmed.match(/^```(?:mdx|markdown)?\s*\n([\s\S]*?)\n```$/);
  return (fenced ? fenced[1] : trimmed).trim();
}

export async function writeArticle(
  draft: ContentDraft,
): Promise<{ mdx: string; readTime: string }> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not configured.");
  }

  const client = new Anthropic();
  const stream = client.messages.stream({
    model: MODEL,
    max_tokens: 8000,
    thinking: { type: "disabled" },
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: buildUserPrompt(draft) }],
  });

  const message = await stream.finalMessage();
  const textBlock = message.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Article generation returned no text.");
  }

  const mdx = stripCodeFences(textBlock.text);

  // Validate it compiles as MDX before saving (same check as the preview route).
  await compile(mdx, { outputFormat: "function-body" });

  return { mdx, readTime: estimateReadTime(mdx) };
}

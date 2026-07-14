"use client";

import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, Textarea } from "./field";
import { TopicIdeas } from "./topic-ideas";
import type {
  ContentDraft,
  ContentStudioInput,
  ResearchResult,
} from "@/lib/content-studio/types";
import {
  articleTitleFromTopic,
  normalizeContentStudioInput,
  normalizeResearchKeyword,
} from "@/lib/content-studio/utils";

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error ?? "Request failed.");
  return data as T;
}

export function ResearchWorkspace({
  initialKeyword = "",
}: {
  initialKeyword?: string;
}) {
  const { register, handleSubmit, getValues, setValue } =
    useForm<ContentStudioInput>({
    defaultValues: {
      keyword: initialKeyword,
      category: "Education",
      audience: "Fragrance-curious collectors and waitlist visitors",
    },
  });

  const researchMutation = useMutation({
    mutationFn: (input: ContentStudioInput) =>
      postJson<{ research: ResearchResult }>(
        "/api/admin/content/research",
        normalizeContentStudioInput(input),
      ),
  });

  const draftMutation = useMutation({
    mutationFn: (research?: ResearchResult) =>
      postJson<{ draft: ContentDraft }>("/api/admin/content/drafts", {
        input: normalizeContentStudioInput(getValues()),
        research,
      }),
  });

  async function createDraft(research?: ResearchResult) {
    const result = await draftMutation.mutateAsync(research);
    window.location.href = `/content/editor/${result.draft.id}`;
  }

  const research = researchMutation.data?.research;

  return (
    <div className="grid gap-12 lg:grid-cols-[360px_1fr]">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <p className="eyebrow text-amber mb-3">Article brief</p>
        <form
          onSubmit={handleSubmit((values) => researchMutation.mutate(values))}
          className="space-y-5"
        >
          <Field label="Article title">
            <Input {...register("title", { required: true })} />
          </Field>
          <Field label="Target keyword">
            <Input {...register("keyword", { required: true })} />
          </Field>
          <Field label="Category">
            <Input {...register("category", { required: true })} />
          </Field>
          <Field label="Target audience">
            <Input {...register("audience", { required: true })} />
          </Field>
          <Field label="Optional notes">
            <Textarea {...register("notes")} />
          </Field>
          {researchMutation.error && (
            <p className="text-sm text-red">{researchMutation.error.message}</p>
          )}
          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={researchMutation.isPending}>
              {researchMutation.isPending
                ? "Researching..."
                : "Generate research"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={draftMutation.isPending}
              onClick={() => createDraft(research)}
            >
              Create draft
            </Button>
          </div>
        </form>

        <div className="mt-10">
          <TopicIdeas
            onSelect={(keyword, angle) => {
              const cleanKeyword = normalizeResearchKeyword(keyword);
              const currentTitle = getValues("title")?.trim();
              if (!currentTitle) {
                setValue("title", articleTitleFromTopic(keyword), {
                  shouldDirty: true,
                  shouldTouch: true,
                });
              }
              setValue("keyword", cleanKeyword, {
                shouldDirty: true,
                shouldTouch: true,
              });
              setValue("notes", angle, {
                shouldDirty: true,
                shouldTouch: true,
              });
            }}
          />
        </div>
      </aside>

      <main className="space-y-10">
        {!research && (
          <div>
            <p className="eyebrow text-amber mb-3">Research output</p>
            <p className="serif max-w-2xl text-2xl font-light leading-snug text-ink">
              Search intent, competing structures, gaps, questions, and the
              generator brief will appear here.
            </p>
          </div>
        )}

        {research && (
          <>
            <section className="border-y border-dust py-6">
              <p className="eyebrow text-amber mb-3">Research summary</p>
              <div className="space-y-5 text-sm leading-relaxed text-ash">
                <p className="serif text-2xl font-light leading-snug text-ink">
                  {research.summary}
                </p>
                <p>
                  <span className="font-medium text-ink">Intent:</span>{" "}
                  {research.searchIntent}
                </p>
                <p>
                  <span className="font-medium text-ink">Angle:</span>{" "}
                  {research.suggestedAngle}
                </p>
                <p>
                  <span className="font-medium text-ink">Tension:</span>{" "}
                  {research.tension}
                </p>
              </div>
            </section>

            <div className="grid gap-8 md:grid-cols-2">
              <ResearchList
                title="Competitor headings"
                items={research.competitorHeadings}
              />
              <ResearchList
                title="Common questions"
                items={research.commonQuestions}
              />
              <ResearchList title="Content gaps" items={research.contentGaps} />
              <ResearchList
                title="Recommended outline"
                items={research.recommendedOutline}
              />
            </div>

            <section>
              <p className="eyebrow text-amber mb-3">Top results</p>
              <div className="border-y border-dust">
                {research.topResults.map((result) => (
                  <a
                    key={result.url}
                    href={result.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block border-b border-dust py-5 last:border-b-0"
                  >
                    <p className="font-medium text-ink hover:text-amber">
                      {result.title}
                    </p>
                    <p className="mt-1 text-xs text-amber">{result.url}</p>
                    <p className="mt-2 text-sm text-ash">{result.snippet}</p>
                  </a>
                ))}
              </div>
            </section>

            <div className="flex items-center gap-3">
              <Button onClick={() => createDraft(research)}>
                Create editable draft
              </Button>
              <Link
                className="text-sm text-ash hover:text-ink"
                href="/content/drafts"
              >
                View drafts
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function ResearchList({ title, items }: { title: string; items: string[] }) {
  return (
    <section>
      <p className="eyebrow text-amber mb-3">{title}</p>
      <div className="border-y border-dust">
        {items.length ? (
          items.map((item) => (
            <div
              key={item}
              className="border-b border-dust py-3 text-sm text-ash last:border-b-0"
            >
              <span>{item}</span>
            </div>
          ))
        ) : (
          <p className="py-3 text-sm text-ash">No strong pattern found.</p>
        )}
      </div>
    </section>
  );
}

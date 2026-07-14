"use client";

import { useEffect, useMemo, useState } from "react";
import { evaluate } from "@mdx-js/mdx";
import { useMutation } from "@tanstack/react-query";
import { ChevronDownIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as runtime from "react/jsx-runtime";
import {
  mdxComponents,
  type MDXComponents,
} from "@/components/blog/mdx-components";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Field, Textarea } from "./field";
import { SkeletonLine } from "./skeleton";
import type { ContentDraft, DraftStatus } from "@/lib/content-studio/types";

type SavePatch = Partial<
  Pick<
    ContentDraft,
    | "slug"
    | "status"
    | "frontmatter"
    | "mdx"
    | "seoTitle"
    | "metaDescription"
    | "generatorBrief"
  >
>;

async function patchDraft(id: string, patch: SavePatch) {
  const response = await fetch(`/api/admin/content/drafts/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error ?? "Unable to save draft.");
  return data.draft as ContentDraft;
}

export function EditorWorkspace({
  initialDraft,
}: {
  initialDraft: ContentDraft;
}) {
  const [draft, setDraft] = useState(initialDraft);
  const [previewSource, setPreviewSource] = useState(initialDraft.mdx);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const saveMutation = useMutation({
    mutationFn: (patch: SavePatch) => patchDraft(draft.id, patch),
    onSuccess: (updated) => {
      setDraft(updated);
      setMessage("Saved.");
      setError("");
    },
    onError: (saveError) => {
      setError(
        saveError instanceof Error ? saveError.message : "Unable to save.",
      );
    },
  });

  const previewMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `/api/admin/content/drafts/${draft.id}/preview`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            frontmatter: draft.frontmatter,
            mdx: draft.mdx,
          }),
        },
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Unable to preview MDX.");
      return true;
    },
    onSuccess: () => {
      setPreviewSource(draft.mdx);
      setPreviewOpen(true);
      setError("");
    },
    onError: (previewError) => {
      setError(
        previewError instanceof Error
          ? previewError.message
          : "Preview failed.",
      );
    },
  });

  const publishMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `/api/admin/content/drafts/${draft.id}/publish`,
        {
          method: "POST",
        },
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Unable to publish.");
      return data.draft as ContentDraft;
    },
    onSuccess: (updated) => {
      setDraft(updated);
      setMessage(`Published ${updated.slug}.mdx for Git review.`);
      setError("");
    },
    onError: (publishError) => {
      setError(
        publishError instanceof Error
          ? publishError.message
          : "Publish failed.",
      );
    },
  });

  const generateMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `/api/admin/content/drafts/${draft.id}/generate`,
        { method: "POST" },
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error ?? "Unable to generate article.");
      return data.draft as ContentDraft;
    },
    onSuccess: (updated) => {
      setDraft(updated);
      setPreviewSource(updated.mdx);
      setMessage("Article generated.");
      setError("");
    },
    onError: (generateError) => {
      setError(
        generateError instanceof Error
          ? generateError.message
          : "Generation failed.",
      );
    },
  });

  function generateArticle() {
    if (
      draft.mdx.trim() &&
      !window.confirm("Replace the current article body with a new AI draft?")
    ) {
      return;
    }
    generateMutation.mutate();
  }

  const sourceWithFrontmatter = useMemo(
    () =>
      `---\ntitle: ${JSON.stringify(draft.frontmatter.title)}\ndate: ${JSON.stringify(draft.frontmatter.date)}\ncategory: ${JSON.stringify(draft.frontmatter.category)}\nexcerpt: ${JSON.stringify(draft.frontmatter.excerpt)}\nreadTime: ${JSON.stringify(draft.frontmatter.readTime)}\n---\n\n${draft.mdx}`,
    [draft.frontmatter, draft.mdx],
  );

  function updateFrontmatter(
    key: keyof ContentDraft["frontmatter"],
    value: string,
  ) {
    setDraft((current) => ({
      ...current,
      frontmatter: { ...current.frontmatter, [key]: value },
    }));
  }

  function save() {
    saveMutation.mutate({
      slug: draft.slug,
      status: draft.status,
      frontmatter: draft.frontmatter,
      mdx: draft.mdx,
      seoTitle: draft.seoTitle,
      metaDescription: draft.metaDescription,
      generatorBrief: draft.generatorBrief,
    });
  }

  return (
    <div className="space-y-6">
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-h-[86vh] overflow-y-auto rounded-lg border border-dust bg-parchment p-6 text-ink shadow-2xl sm:max-w-3xl md:p-10">
          <DialogHeader className="border-b border-dust pb-6">
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <Badge className="border-dust bg-white/60 text-ash">
                {draft.frontmatter.category}
              </Badge>
              <span className="text-xs text-ash">
                {draft.frontmatter.readTime}
              </span>
              <span className="text-xs text-ash">{draft.frontmatter.date}</span>
            </div>
            <DialogTitle className="serif text-4xl font-light leading-tight text-ink">
              {draft.frontmatter.title || "Untitled article"}
            </DialogTitle>
            <DialogDescription className="serif mt-3 text-lg font-light italic leading-relaxed text-ash">
              {draft.frontmatter.excerpt}
            </DialogDescription>
          </DialogHeader>
          <div className="pt-6">
            {previewSource ? (
              <ClientMdxPreview source={previewSource} />
            ) : (
              <p className="text-sm text-ash">Add MDX content to preview.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Badge className="border-dust bg-white/60 text-ash">
              {draft.status.replace("_", " ")}
            </Badge>
            <span className="text-xs text-ash">{draft.slug}.mdx</span>
          </div>
          <h1 className="serif text-3xl font-light text-ink">
            {draft.frontmatter.title}
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={save} disabled={saveMutation.isPending}>
            {saveMutation.isPending ? "Saving..." : "Save"}
          </Button>
          <Button
            variant="outline"
            onClick={() => previewMutation.mutate()}
            disabled={previewMutation.isPending}
          >
            Preview
          </Button>
          <Button
            variant="amber"
            onClick={() => publishMutation.mutate()}
            disabled={publishMutation.isPending || draft.status === "published"}
          >
            Publish MDX
          </Button>
        </div>
      </div>

      {(message || error) && (
        <p className={error ? "text-sm text-red" : "text-sm text-ash"}>
          {error || message}
        </p>
      )}

      <div className="grid gap-12 xl:grid-cols-[0.82fr_1.18fr]">
        <aside className="space-y-10">
          <section className="border-y border-dust py-6">
            <p className="eyebrow text-amber mb-5">Frontmatter</p>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Title" className="md:col-span-2">
                <Input
                  value={draft.frontmatter.title}
                  onChange={(event) =>
                    updateFrontmatter("title", event.target.value)
                  }
                />
              </Field>
              <Field label="Date">
                <Input
                  type="date"
                  value={draft.frontmatter.date}
                  onChange={(event) =>
                    updateFrontmatter("date", event.target.value)
                  }
                />
              </Field>
              <Field label="Category">
                <Input
                  value={draft.frontmatter.category}
                  onChange={(event) =>
                    updateFrontmatter("category", event.target.value)
                  }
                />
              </Field>
              <Field label="Read time">
                <Input
                  value={draft.frontmatter.readTime}
                  onChange={(event) =>
                    updateFrontmatter("readTime", event.target.value)
                  }
                />
              </Field>
              <Field label="Slug">
                <Input
                  value={draft.slug}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      slug: event.target.value,
                    }))
                  }
                />
              </Field>
              <Field label="Excerpt" className="md:col-span-2">
                <Textarea
                  value={draft.frontmatter.excerpt}
                  onChange={(event) =>
                    updateFrontmatter("excerpt", event.target.value)
                  }
                />
              </Field>
            </div>
          </section>

          <section className="border-y border-dust py-6">
            <p className="eyebrow text-amber mb-5">SEO</p>
            <div className="space-y-4">
              <Field label="SEO title">
                <Input
                  value={draft.seoTitle}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      seoTitle: event.target.value,
                    }))
                  }
                />
              </Field>
              <Field label="Meta description">
                <Textarea
                  value={draft.metaDescription}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      metaDescription: event.target.value,
                    }))
                  }
                />
              </Field>
              <Field label="Status">
                <div className="relative">
                  <select
                    className="h-12 w-full appearance-none rounded-full border border-dust bg-white/60 px-5 pr-11 text-sm text-ink outline-none focus:border-amber focus:ring-2 focus:ring-amber/20"
                    value={draft.status}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        status: event.target.value as DraftStatus,
                      }))
                    }
                  >
                    <option value="draft">Draft</option>
                    <option value="in_review">In review</option>
                    <option value="published">Published</option>
                  </select>
                  <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-ash">
                    <HugeiconsIcon icon={ChevronDownIcon} size={16} />
                  </span>
                </div>
              </Field>
            </div>
          </section>

          <section className="border-y border-dust py-6">
            <p className="eyebrow text-amber mb-5">Generator brief</p>
            <Textarea
              className="min-h-80 rounded-lg font-mono text-xs leading-relaxed"
              value={draft.generatorBrief}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  generatorBrief: event.target.value,
                }))
              }
            />
          </section>
        </aside>

        <main className="space-y-10">
          <section className="border-y border-dust py-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <p className="eyebrow text-amber">MDX editor</p>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={generateArticle}
                disabled={generateMutation.isPending || !draft.research}
                title={
                  draft.research
                    ? undefined
                    : "Add research to this draft first."
                }
              >
                {generateMutation.isPending
                  ? "Writing article..."
                  : "Write article with AI"}
              </Button>
            </div>
            <Textarea
              className="min-h-[620px] rounded-lg font-mono text-xs leading-relaxed"
              value={draft.mdx}
              onChange={(event) =>
                setDraft((current) => ({ ...current, mdx: event.target.value }))
              }
            />
          </section>

          <section className="border-y border-dust py-6">
            <p className="eyebrow text-amber mb-5">Source with frontmatter</p>
            <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-lg border border-dust bg-white/60 p-4 text-xs text-ash">
              {sourceWithFrontmatter}
            </pre>
          </section>
        </main>
      </div>

      {draft.research && (
        <section className="border-y border-dust py-6">
          <p className="eyebrow text-amber mb-5">Research context</p>
          <div className="grid gap-8 md:grid-cols-3">
            <ResearchList
              title="Content gaps"
              items={draft.research.contentGaps}
            />
            <ResearchList
              title="Questions"
              items={draft.research.commonQuestions}
            />
            <ResearchList
              title="Internal links"
              items={draft.research.internalLinks.map(
                (link) => `${link.title} (${link.slug})`,
              )}
            />
          </div>
        </section>
      )}
    </div>
  );
}

function ClientMdxPreview({ source }: { source: string }) {
  const [Preview, setPreview] = useState<React.ComponentType<{
    components?: MDXComponents;
  }> | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    evaluate(source, {
      ...runtime,
      baseUrl: window.location.href,
    })
      .then(({ default: MdxContent }) => {
        if (!cancelled) {
          setPreview(
            () =>
              MdxContent as React.ComponentType<{
                components?: MDXComponents;
              }>,
          );
          setError("");
        }
      })
      .catch((previewError) => {
        if (!cancelled) {
          setPreview(null);
          setError(
            previewError instanceof Error
              ? previewError.message
              : "Unable to render preview.",
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [source]);

  if (error) {
    return <p className="text-sm text-red">{error}</p>;
  }

  if (!Preview) {
    return (
      <div className="space-y-4">
        <SkeletonLine className="h-5 w-2/3" />
        <SkeletonLine className="w-full" />
        <SkeletonLine className="w-11/12" />
        <SkeletonLine className="w-4/5" />
      </div>
    );
  }

  return (
    <div className="prose-olfaire space-y-6">
      <Preview components={mdxComponents} />
    </div>
  );
}

function ResearchList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="mb-3 text-xs font-medium uppercase tracking-accent text-ash">
        {title}
      </p>
      <ul className="space-y-2 text-sm text-ash">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

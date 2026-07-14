"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SkeletonDraftRows } from "./skeleton";
import type { ContentDraft } from "@/lib/content-studio/types";

async function getDrafts() {
  const response = await fetch("/api/admin/content/drafts");
  const data = await response.json();
  if (!response.ok) throw new Error(data.error ?? "Unable to load drafts.");
  return data.drafts as ContentDraft[];
}

export function DraftsTable() {
  const queryClient = useQueryClient();
  const { data: drafts = [], error, isLoading } = useQuery({
    queryKey: ["content-drafts"],
    queryFn: getDrafts,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/content/drafts/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Unable to delete draft.");
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["content-drafts"] }),
  });

  return (
    <section>
      <div className="mb-6">
        <p className="eyebrow text-amber mb-3">Drafts</p>
        <h1 className="serif text-4xl font-light text-ink">
          Articles waiting for review
        </h1>
      </div>
      <div className="border-y border-dust">
        {isLoading && <SkeletonDraftRows />}
        {error && <p className="text-sm text-red">{error.message}</p>}
        {!isLoading && !drafts.length && (
          <p className="py-8 text-sm text-ash">No drafts yet.</p>
        )}
        {drafts.map((draft) => (
          <div
            key={draft.id}
            className="grid gap-4 border-b border-dust py-5 last:border-b-0 md:grid-cols-[1fr_auto] md:items-center"
          >
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Badge className="border-dust bg-white/60 text-ash">
                  {draft.status.replace("_", " ")}
                </Badge>
                <span className="text-xs text-ash">{draft.slug}.mdx</span>
              </div>
              <p className="font-medium text-ink">{draft.frontmatter.title}</p>
              <p className="mt-1 text-sm text-ash">{draft.input.keyword}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/content/editor/${draft.id}`}
                className="rounded-full bg-ink px-4 py-2 text-xs font-medium text-parchment transition-colors hover:bg-amber"
              >
                Edit
              </Link>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={deleteMutation.isPending}
                onClick={() => deleteMutation.mutate(draft.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

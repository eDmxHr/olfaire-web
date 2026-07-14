"use client";

import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SkeletonLine, SkeletonPill } from "./skeleton";
import type { TopicIdea } from "@/lib/content-studio/topic-ideas";

async function getIdeas() {
  const response = await fetch("/api/admin/content/topic-ideas");
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error ?? "Unable to load topic ideas.");
  }
  return data.ideas as TopicIdea[];
}

function sourceLabel(source: TopicIdea["source"]) {
  switch (source) {
    case "search_console":
      return "Search Console";
    case "tavily":
      return "Tavily";
    case "reddit":
      return "Reddit";
    default:
      return "Fallback";
  }
}

export function TopicIdeas({
  onSelect,
}: {
  onSelect: (keyword: string, angle: string) => void;
}) {
  const { data: ideas = [], isLoading, error } = useQuery({
    queryKey: ["content-topic-ideas"],
    queryFn: getIdeas,
    staleTime: 1000 * 60 * 15,
  });

  return (
    <section className="border-y border-dust py-6">
      <p className="eyebrow text-amber mb-3">Topic ideas</p>
      <p className="mb-5 text-sm leading-relaxed text-ash">
        Starting points from Search Console, Tavily SERP discovery, and Reddit
        question signals. Fallback ideas appear only when live sources are
        unavailable.
      </p>

      {isLoading && (
        <div className="space-y-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index}>
              <div className="mb-3 flex items-center gap-2">
                <SkeletonPill className="w-24" />
                <SkeletonLine className="h-2 w-20" />
              </div>
              <SkeletonLine className="mb-2 h-4 w-3/4" />
              <SkeletonLine className="w-full" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="text-sm text-ash">Topic ideas are unavailable right now.</p>
      )}

      {!isLoading && !error && (
        <div className="space-y-5">
          {ideas.map((idea) => (
            <div
              key={idea.keyword}
              className="border-t border-dust pt-5 first:border-t-0 first:pt-0"
            >
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Badge className="border-dust bg-white/60 text-ash">
                  {sourceLabel(idea.source)}
                </Badge>
                <span className="text-xs text-ash">
                  score {Math.round(idea.score)}
                </span>
              </div>
              <p className="font-medium text-ink">{idea.keyword}</p>
              <p className="mt-1 text-sm leading-relaxed text-ash">
                {idea.angle}
              </p>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="mt-2 px-0 text-amber hover:bg-transparent hover:text-ink"
                onClick={() => onSelect(idea.keyword, idea.angle)}
              >
                Use this topic
              </Button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

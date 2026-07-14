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
      return "Trend synthesis";
    case "reddit":
      return "Reddit";
    default:
      return "Fallback";
  }
}

function levelClass(level?: "low" | "medium" | "high") {
  switch (level) {
    case "high":
      return "text-emerald-700";
    case "medium":
      return "text-amber";
    case "low":
      return "text-ash";
    default:
      return "text-ash";
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
        Trending, SEO-oriented article ideas synthesized from Google Trends,
        recent fragrance news, Reddit discussion, and Search Console demand.
        Prioritize high-traffic, low-difficulty topics. Fallback ideas appear
        only when live sources are unavailable.
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
                {idea.searchIntent && (
                  <Badge className="border-dust bg-white/60 capitalize text-ash">
                    {idea.searchIntent}
                  </Badge>
                )}
                {idea.trafficPotential && (
                  <span className={`text-xs ${levelClass(idea.trafficPotential)}`}>
                    traffic: {idea.trafficPotential}
                  </span>
                )}
                {idea.difficulty && (
                  <span className={`text-xs ${levelClass(idea.difficulty)}`}>
                    difficulty: {idea.difficulty}
                  </span>
                )}
                {idea.estimated && (
                  <span className="text-xs text-ash/70">(est.)</span>
                )}
              </div>
              <p className="font-medium text-ink">{idea.keyword}</p>
              <p className="mt-1 text-sm leading-relaxed text-ash">
                {idea.angle}
              </p>
              {idea.trendRationale && (
                <p className="mt-2 text-xs leading-relaxed text-ash">
                  <span className="font-medium text-ink">Why now:</span>{" "}
                  {idea.trendRationale}
                </p>
              )}
              {idea.appAngle && (
                <p className="mt-1 text-xs leading-relaxed text-ash">
                  <span className="font-medium text-ink">App hook:</span>{" "}
                  {idea.appAngle}
                </p>
              )}
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

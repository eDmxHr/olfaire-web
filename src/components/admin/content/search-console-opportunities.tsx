"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { SkeletonOpportunityRows } from "./skeleton";
import type {
  SearchConsoleOpportunity,
  SearchConsoleQuery,
} from "@/lib/content-studio/search-console";

interface OpportunitiesResponse {
  startDate: string;
  endDate: string;
  rowCount: number;
  opportunities: SearchConsoleOpportunity[];
  topQueries: SearchConsoleQuery[];
}

async function getOpportunities() {
  const response = await fetch(
    "/api/admin/content/search-console/opportunities",
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(
      data.error ?? "Unable to load Search Console opportunities.",
    );
  }
  return data as OpportunitiesResponse;
}

function formatPercent(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

function labelForType(type: SearchConsoleOpportunity["type"]) {
  if (type === "low_ctr") return "Low CTR";
  if (type === "page_two") return "Near page 1";
  return "Gap";
}

export function SearchConsoleOpportunities() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["search-console-opportunities"],
    queryFn: getOpportunities,
    staleTime: 1000 * 60 * 15,
  });

  return (
    <section className="space-y-4">
      <div>
        <p className="eyebrow text-amber mb-2">Search Console</p>
        <h2 className="serif text-2xl font-light text-ink">Opportunities</h2>
      </div>
      <div className="border-y border-dust py-4">
        {isLoading && <SkeletonOpportunityRows />}

        {error && (
          <p className="text-sm text-ash">
            Search Console is connected here when Google credentials and
            property access are available.
          </p>
        )}

        {data && (
          <>
            <p className="mb-4 text-xs text-ash">
              {data.rowCount.toLocaleString()} rows from {data.startDate} to{" "}
              {data.endDate}
            </p>
            {!data.opportunities.length && (
              <TopQueries queries={data.topQueries} />
            )}
            <div className="space-y-4">
              {data.opportunities.map((item) => (
                <div
                  key={`${item.type}-${item.query}-${item.page ?? ""}`}
                  className="border-t border-dust py-4 first:border-t-0 first:pt-0 last:pb-0"
                >
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <Badge className="border-dust bg-white/60 text-ash">
                      {labelForType(item.type)}
                    </Badge>
                    <span className="text-xs text-ash">
                      {item.impressions.toLocaleString()} impressions ·{" "}
                      {formatPercent(item.ctr)} CTR · pos{" "}
                      {item.position.toFixed(1)}
                    </span>
                  </div>
                  <p className="font-medium text-ink">{item.query}</p>
                  <p className="mt-1 text-sm text-ash">{item.reason}</p>
                  <Link
                    href={`/content/research?keyword=${encodeURIComponent(
                      item.query,
                    )}`}
                    className="mt-3 inline-flex text-sm text-amber hover:text-ink"
                  >
                    Research this keyword
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function TopQueries({ queries }: { queries: SearchConsoleQuery[] }) {
  if (!queries.length) {
    return (
      <p className="text-sm text-ash">
        Search Console returned no query rows for this date range yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-ash">
        No strong opportunity pattern yet. These are the top queries worth
        watching.
      </p>
      {queries.map((item) => (
        <div
          key={`${item.query}-${item.page ?? ""}`}
          className="border-t border-dust py-4 first:border-t-0 first:pt-0 last:pb-0"
        >
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge className="border-dust bg-white/60 text-ash">Watch</Badge>
            <span className="text-xs text-ash">
              {item.impressions.toLocaleString()} impressions ·{" "}
              {formatPercent(item.ctr)} CTR · pos {item.position.toFixed(1)}
            </span>
          </div>
          <p className="font-medium text-ink">{item.query}</p>
          <Link
            href={`/content/research?keyword=${encodeURIComponent(item.query)}`}
            className="mt-3 inline-flex text-sm text-amber hover:text-ink"
          >
            Research this keyword
          </Link>
        </div>
      ))}
    </div>
  );
}

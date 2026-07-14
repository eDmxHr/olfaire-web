import "server-only";

import crypto from "crypto";
import { getAllPosts } from "@/lib/mdx";

export interface SearchConsoleOpportunity {
  type: "low_ctr" | "page_two" | "content_gap";
  query: string;
  page?: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  reason: string;
  action: string;
}

export interface SearchConsoleQuery {
  query: string;
  page?: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface SearchConsoleRow {
  keys?: string[];
  clicks?: number;
  impressions?: number;
  ctr?: number;
  position?: number;
}

interface SearchConsoleResponse {
  rows?: SearchConsoleRow[];
}

function base64Url(value: Buffer | string) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function getPrivateKey() {
  return (process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY ?? "").replace(
    /\\n/g,
    "\n",
  );
}

function getDateRange(days = 90) {
  const end = new Date();
  end.setDate(end.getDate() - 3);
  const start = new Date(end);
  start.setDate(start.getDate() - days);

  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
}

async function getAccessToken() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = getPrivateKey();

  if (!email || !privateKey) {
    throw new Error("Search Console credentials are unavailable.");
  }

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claimSet = {
    iss: email,
    scope: "https://www.googleapis.com/auth/webmasters.readonly",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };
  const unsigned = `${base64Url(JSON.stringify(header))}.${base64Url(
    JSON.stringify(claimSet),
  )}`;
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(unsigned);
  signer.end();
  const signature = signer.sign(privateKey);
  const assertion = `${unsigned}.${base64Url(signature)}`;

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    throw new Error("Unable to authenticate with Google Search Console.");
  }

  const data = (await response.json()) as { access_token?: string };
  if (!data.access_token) {
    throw new Error("Google Search Console did not return an access token.");
  }

  return data.access_token;
}

const BRAND_TERMS = ["olfaire"];

function editDistance(a: string, b: string) {
  const rows = Array.from({ length: a.length + 1 }, (_, i) => [
    i,
    ...Array(b.length).fill(0),
  ]);
  for (let j = 1; j <= b.length; j += 1) rows[0][j] = j;
  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      rows[i][j] = Math.min(
        rows[i - 1][j] + 1,
        rows[i][j - 1] + 1,
        rows[i - 1][j - 1] + cost,
      );
    }
  }
  return rows[a.length][b.length];
}

function isBrandQuery(query: string) {
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  return tokens.some((token) =>
    BRAND_TERMS.some(
      (brand) => token === brand || editDistance(token, brand) <= 2,
    ),
  );
}

function isTopicalBlogPage(page?: string) {
  return Boolean(page && /\/blog\//.test(page));
}

function hasExistingArticle(query: string) {
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .filter((term) => term.length > 3);

  return getAllPosts().some((post) => {
    const haystack = `${post.title} ${post.slug} ${post.excerpt}`.toLowerCase();
    return terms.some((term) => haystack.includes(term));
  });
}

function buildOpportunities(rows: SearchConsoleRow[]) {
  // One opportunity per query, choosing the single best type by priority:
  // page_two > content_gap > low_ctr.
  const byQuery = new Map<string, SearchConsoleOpportunity>();

  for (const row of rows) {
    const [query, page] = row.keys ?? [];
    if (!query || isBrandQuery(query)) continue;

    const clicks = row.clicks ?? 0;
    const impressions = row.impressions ?? 0;
    const ctr = row.ctr ?? 0;
    const position = row.position ?? 0;

    if (impressions < 10) continue;

    const base = { query, page, clicks, impressions, ctr, position };
    let opportunity: SearchConsoleOpportunity | null = null;

    if (position >= 8 && position <= 20) {
      opportunity = {
        ...base,
        type: "page_two",
        reason: "This query is close enough to improve with a stronger article or refresh.",
        action: "Research the query and create or improve a focused article.",
      };
    } else if (!hasExistingArticle(query) && !isTopicalBlogPage(page)) {
      opportunity = {
        ...base,
        type: "content_gap",
        reason: "Olfaire has visibility for this query, but no matching article yet.",
        action: "Create a Content Studio brief around this keyword.",
      };
    } else if (ctr < 0.03) {
      opportunity = {
        ...base,
        type: "low_ctr",
        reason: "Google is showing Olfaire, but searchers are not clicking often.",
        action: "Review the title, excerpt, and article angle for this query.",
      };
    }

    if (opportunity) {
      byQuery.set(query, opportunity);
    }
  }

  return Array.from(byQuery.values())
    .sort((a, b) => b.impressions - a.impressions || a.position - b.position)
    .slice(0, 8);
}

function buildTopQueries(rows: SearchConsoleRow[]): SearchConsoleQuery[] {
  return rows
    .map<SearchConsoleQuery | null>((row) => {
      const [query, page] = row.keys ?? [];
      if (!query || isBrandQuery(query)) return null;
      return {
        query,
        page,
        clicks: row.clicks ?? 0,
        impressions: row.impressions ?? 0,
        ctr: row.ctr ?? 0,
        position: row.position ?? 0,
      };
    })
    .filter((row): row is SearchConsoleQuery => Boolean(row))
    .sort((a, b) => b.impressions - a.impressions || b.clicks - a.clicks)
    .slice(0, 8);
}

export async function getSearchConsoleOpportunities() {
  const siteUrl = process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL;
  if (!siteUrl) {
    throw new Error("Search Console site URL is unavailable.");
  }

  const accessToken = await getAccessToken();
  const { startDate, endDate } = getDateRange();
  const response = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
      siteUrl,
    )}/searchAnalytics/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        startDate,
        endDate,
        dimensions: ["query", "page"],
        type: "web",
        rowLimit: 100,
      }),
      signal: AbortSignal.timeout(15000),
    },
  );

  if (!response.ok) {
    throw new Error("Unable to load Search Console data.");
  }

  const data = (await response.json()) as SearchConsoleResponse;
  const rows = data.rows ?? [];

  return {
    startDate,
    endDate,
    rowCount: rows.length,
    opportunities: buildOpportunities(rows),
    topQueries: buildTopQueries(rows),
  };
}

import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { checkRateLimit } from "@/lib/content-studio/rate-limit";
import { getTopicIdeas } from "@/lib/content-studio/topic-ideas";

export async function GET() {
  const { user, response } = await requireAdminApi();
  if (response) return response;

  const limit = checkRateLimit(`topic-ideas:${user.id}`, 5);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many topic-idea requests. Please slow down." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  const ideas = await getTopicIdeas();
  return NextResponse.json({ ideas });
}

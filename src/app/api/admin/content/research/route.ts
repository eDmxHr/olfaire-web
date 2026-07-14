import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { checkRateLimit } from "@/lib/content-studio/rate-limit";
import { getResearchService } from "@/lib/content-studio/research";
import { normalizeContentStudioInput } from "@/lib/content-studio/utils";
import type { ContentStudioInput } from "@/lib/content-studio/types";

export async function POST(req: NextRequest) {
  const { user, response } = await requireAdminApi();
  if (response) return response;

  const limit = checkRateLimit(`research:${user.id}`, 10);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many research requests. Please slow down." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  try {
    const input = normalizeContentStudioInput(
      (await req.json()) as ContentStudioInput,
    );
    if (!input.title || !input.keyword || !input.category || !input.audience) {
      return NextResponse.json(
        { error: "Title, keyword, category, and audience are required." },
        { status: 400 },
      );
    }

    const research = await getResearchService().search(input);
    return NextResponse.json({ research });
  } catch (error) {
    console.error("Content Studio research error:", error);
    return NextResponse.json(
      { error: "Research is unavailable right now." },
      { status: 500 },
    );
  }
}

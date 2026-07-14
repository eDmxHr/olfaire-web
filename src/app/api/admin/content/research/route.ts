import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { getResearchService } from "@/lib/content-studio/research";
import { normalizeContentStudioInput } from "@/lib/content-studio/utils";
import type { ContentStudioInput } from "@/lib/content-studio/types";

export async function POST(req: NextRequest) {
  const { response } = await requireAdminApi();
  if (response) return response;

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

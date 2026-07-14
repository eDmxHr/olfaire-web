import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { createDraft, listDrafts } from "@/lib/content-studio/drafts";
import { normalizeContentStudioInput } from "@/lib/content-studio/utils";
import type { ContentStudioInput, ResearchResult } from "@/lib/content-studio/types";

export async function GET() {
  const { response } = await requireAdminApi();
  if (response) return response;

  const drafts = await listDrafts();
  return NextResponse.json({ drafts });
}

export async function POST(req: NextRequest) {
  const { response } = await requireAdminApi();
  if (response) return response;

  try {
    const body = (await req.json()) as {
      input?: ContentStudioInput;
      research?: ResearchResult;
    };

    const input = body.input
      ? normalizeContentStudioInput(body.input)
      : undefined;

    if (!input?.title || !input.keyword || !input.category || !input.audience) {
      return NextResponse.json(
        { error: "Title, keyword, category, and audience are required." },
        { status: 400 },
      );
    }

    const draft = await createDraft(input, body.research);
    return NextResponse.json({ draft }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Draft creation failed." },
      { status: 500 },
    );
  }
}

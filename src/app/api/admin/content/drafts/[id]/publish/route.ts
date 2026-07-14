import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { publishDraft } from "@/lib/content-studio/drafts";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { response } = await requireAdminApi();
  if (response) return response;

  try {
    const { id } = await params;
    const draft = await publishDraft(id);
    return NextResponse.json({ draft });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Publish failed." },
      { status: 400 },
    );
  }
}

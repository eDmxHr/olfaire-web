import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import {
  deleteDraft,
  getDraft,
  updateDraft,
} from "@/lib/content-studio/drafts";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { response } = await requireAdminApi();
  if (response) return response;

  try {
    const { id } = await params;
    const draft = await getDraft(id);
    return NextResponse.json({ draft });
  } catch {
    return NextResponse.json({ error: "Draft not found." }, { status: 404 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { response } = await requireAdminApi();
  if (response) return response;

  try {
    const { id } = await params;
    const patch = await req.json();
    const draft = await updateDraft(id, patch);
    return NextResponse.json({ draft });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Draft update failed." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { response } = await requireAdminApi();
  if (response) return response;

  try {
    const { id } = await params;
    await deleteDraft(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Draft not found." }, { status: 404 });
  }
}

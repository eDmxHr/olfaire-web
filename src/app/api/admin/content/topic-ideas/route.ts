import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { getTopicIdeas } from "@/lib/content-studio/topic-ideas";

export async function GET() {
  const { response } = await requireAdminApi();
  if (response) return response;

  const ideas = await getTopicIdeas();
  return NextResponse.json({ ideas });
}

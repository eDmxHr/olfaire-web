import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { getSearchConsoleOpportunities } from "@/lib/content-studio/search-console";

export async function GET() {
  const { response } = await requireAdminApi();
  if (response) return response;

  try {
    const data = await getSearchConsoleOpportunities();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Search Console opportunities error:", error);
    return NextResponse.json(
      { error: "Search Console opportunities are unavailable." },
      { status: 503 },
    );
  }
}

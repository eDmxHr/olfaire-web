import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { writeArticle } from "@/lib/content-studio/article-writer";
import { getDraft, updateDraft } from "@/lib/content-studio/drafts";
import { checkRateLimit } from "@/lib/content-studio/rate-limit";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { user, response } = await requireAdminApi();
  if (response) return response;

  const limit = checkRateLimit(`article:${user.id}`, 5);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many generation requests. Please slow down." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  try {
    const { id } = await params;
    const draft = await getDraft(id);
    const { mdx, readTime } = await writeArticle(draft);
    const updated = await updateDraft(id, {
      mdx,
      frontmatter: { ...draft.frontmatter, readTime },
    });
    return NextResponse.json({ draft: updated });
  } catch (error) {
    console.error("Content Studio article generation error:", error);
    return NextResponse.json(
      { error: "Article generation is unavailable right now." },
      { status: 500 },
    );
  }
}

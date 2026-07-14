import { NextRequest, NextResponse } from "next/server";
import { compile } from "@mdx-js/mdx";
import { requireAdminApi } from "@/lib/admin-auth";
import type { DraftFrontmatter } from "@/lib/content-studio/types";

export async function POST(req: NextRequest) {
  const { response } = await requireAdminApi();
  if (response) return response;

  try {
    const body = (await req.json()) as {
      frontmatter: DraftFrontmatter;
      mdx: string;
    };

    await compile(body.mdx, {
      outputFormat: "function-body",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Content Studio MDX preview error:", error);
    return NextResponse.json(
      { error: "MDX preview failed." },
      { status: 400 },
    );
  }
}

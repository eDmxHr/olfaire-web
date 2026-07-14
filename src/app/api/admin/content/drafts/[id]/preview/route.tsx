import { NextRequest, NextResponse } from "next/server";
import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
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

    await evaluate(body.mdx, {
      ...runtime,
      baseUrl: import.meta.url,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "MDX preview failed." },
      { status: 400 },
    );
  }
}

import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/mdx";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let title = "Olfaire Blog";
  let category = "Fragrance";

  try {
    const post = getPostBySlug(slug);
    title = post.title;
    category = post.category;
  } catch {
    // fallback to defaults
  }

  return new ImageResponse(
    <div
      style={{
        background: "#0D0D0A",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: 80,
      }}
    >
      <p
        style={{
          color: "#C9A84C",
          fontSize: 20,
          marginBottom: 24,
          marginTop: 0,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        {category}
      </p>
      <h1
        style={{
          color: "#F5F1EA",
          fontSize: 60,
          lineHeight: 1.1,
          margin: 0,
          fontWeight: 300,
        }}
      >
        {title}
      </h1>
      <p
        style={{
          color: "#8B8680",
          fontSize: 22,
          marginTop: 32,
          marginBottom: 0,
        }}
      >
        Olfaire Blog
      </p>
    </div>,
    { ...size },
  );
}

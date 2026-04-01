import { type NextRequest, NextResponse } from "next/server";
import { getFreshImageUrl } from "@/lib/notion";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const blockId = searchParams.get("blockId");

  if (!blockId) {
    return NextResponse.json({ error: "Missing blockId parameter" }, { status: 400 });
  }

  const imageUrl = await getFreshImageUrl(blockId);

  if (!imageUrl) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(imageUrl);
    if (!upstream.ok) {
      throw new Error(`Upstream responded with ${upstream.status}`);
    }
  } catch {
    return NextResponse.json({ error: "Failed to fetch image from upstream" }, { status: 502 });
  }

  const contentType = upstream.headers.get("content-type") ?? "image/jpeg";

  return new NextResponse(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=2700, stale-while-revalidate=300",
    },
  });
}

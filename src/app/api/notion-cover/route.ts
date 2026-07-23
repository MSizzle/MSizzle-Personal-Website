import { type NextRequest, NextResponse } from "next/server";
import { Client } from "@notionhq/client";
import sharp from "sharp";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

// Cover images render in small card / pinboard slots, never full-bleed, so we
// downscale + re-encode to WebP at the proxy instead of streaming Notion's raw
// 300-700KB originals. A caller can request a specific width via ?w= (e.g. a
// retina 2x card slot); default 640 covers every current surface. Clamped so a
// crafted URL can't ask us to render a huge image.
//
// Success responses carry a long-lived Cache-Control: each pageId(+w)/blockId
// is effectively immutable per content, so s-maxage=31536000 lets Vercel's
// edge serve repeat requests with zero function invocation (no Notion API
// round trip, no sharp re-encode); max-age=300 keeps individual browsers
// revalidating every 5 minutes. Accepted tradeoff: if Monty swaps a Notion
// cover image, different edge POPs may keep serving the old bytes for up to a
// year until naturally evicted or a new deploy busts the cache.
const DEFAULT_WIDTH = 640;
const MIN_WIDTH = 64;
const MAX_WIDTH = 1280;
const WEBP_QUALITY = 72;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const pageId = searchParams.get("pageId");

  if (!pageId) {
    return NextResponse.json({ error: "Missing pageId parameter" }, { status: 400 });
  }

  const wParam = Number.parseInt(searchParams.get("w") ?? "", 10);
  const width = Number.isFinite(wParam)
    ? Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, wParam))
    : DEFAULT_WIDTH;

  try {
    const page = await notion.pages.retrieve({ page_id: pageId });

    if (!("cover" in page) || !page.cover) {
      return NextResponse.json({ error: "No cover image" }, { status: 404 });
    }

    const imageUrl =
      page.cover.type === "external"
        ? page.cover.external.url
        : page.cover.file.url;

    const upstream = await fetch(imageUrl);
    if (!upstream.ok) {
      return NextResponse.json({ error: "Failed to fetch image" }, { status: 502 });
    }

    const original = Buffer.from(await upstream.arrayBuffer());

    // Downscale + re-encode. `.rotate()` first so EXIF-oriented photos come out
    // upright; `withoutEnlargement` never upscales a small source. Any decode
    // failure (unsupported/animated format, corrupt bytes) falls through to
    // streaming the original so a cover never silently disappears.
    let body: Buffer;
    let contentType: string;
    try {
      body = await sharp(original)
        .rotate()
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY })
        .toBuffer();
      contentType = "image/webp";
    } catch {
      body = original;
      contentType = upstream.headers.get("content-type") ?? "image/jpeg";
    }

    return new NextResponse(new Uint8Array(body), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=300, s-maxage=31536000, stale-while-revalidate=86400",
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to retrieve page" }, { status: 500 });
  }
}

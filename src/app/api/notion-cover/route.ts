import { type NextRequest, NextResponse } from "next/server";
import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const pageId = searchParams.get("pageId");

  if (!pageId) {
    return NextResponse.json({ error: "Missing pageId parameter" }, { status: 400 });
  }

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

    const contentType = upstream.headers.get("content-type") ?? "image/jpeg";

    return new NextResponse(upstream.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=2700, stale-while-revalidate=300",
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to retrieve page" }, { status: 500 });
  }
}

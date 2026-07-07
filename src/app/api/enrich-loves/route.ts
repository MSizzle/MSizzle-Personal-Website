import { type NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthorized } from "@/lib/enrich/auth";
import { enrichAll, enrichById, summarize } from "@/lib/enrich";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Homepage band 03 renders the pinboard; refresh it after any real write.
const REVALIDATE_PATHS = ["/"];

/** Pull a page id out of a POST body (a Notion button webhook or a plain {pageId}). */
function extractPageId(body: unknown): string | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  const data = b.data as Record<string, unknown> | undefined;
  const source = b.source as Record<string, unknown> | undefined;
  const candidate =
    b.pageId ?? b.page_id ?? data?.id ?? source?.id ?? b.id ?? null;
  return typeof candidate === "string" ? candidate : null;
}

/** GET: scan the whole DB and enrich every candidate row. Used by the Vercel cron. */
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const dryRun = request.nextUrl.searchParams.get("dry") === "1";

  try {
    const results = await enrichAll({ dryRun });
    if (!dryRun && results.some((r) => r.status === "enriched")) {
      for (const p of REVALIDATE_PATHS) revalidatePath(p);
    }
    return NextResponse.json({ ok: true, dryRun, ...summarize(results) });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}

/** POST: enrich a single page by id. Used by a future Notion button webhook. */
export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = await request.json().catch(() => null);
  const pageId = extractPageId(body);
  if (!pageId) {
    return NextResponse.json({ error: "missing pageId" }, { status: 400 });
  }

  try {
    const result = await enrichById(pageId);
    if (result.status === "enriched") {
      for (const p of REVALIDATE_PATHS) revalidatePath(p);
    }
    return NextResponse.json({ ok: true, result });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}

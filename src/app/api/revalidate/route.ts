import { type NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthorized } from "@/lib/enrich/auth";
import { pingIndexNow } from "@/lib/seo/indexnow";
import sitemap from "@/app/sitemap";

export const dynamic = "force-dynamic";

/**
 * On-demand revalidation. ISR otherwise serves cached pages for up to 30 min
 * (see `revalidate` in src/app/page.tsx). Hit this with the shared token to
 * refresh the site within seconds after editing Notion:
 *
 *   https://<site>/api/revalidate?token=<ENRICH_LOVES_TOKEN>
 *
 * Bookmark that link (it is the "refresh" button on the free Notion plan), or
 * point a Notion button at it once you upgrade.
 */
const INDEX_PATHS = ["/", "/writing", "/building"];

/**
 * Every public URL the sitemap knows about, as site-relative paths. The
 * sitemap is the one list that already tracks published posts and projects,
 * so reusing it means IndexNow can never announce a URL the site would not
 * also tell Google about. Falls back to the three index pages if Notion is
 * unreachable, so the refresh button still works offline from the CMS.
 */
async function allPaths(): Promise<string[]> {
  try {
    const entries = await sitemap();
    const paths = entries.map((e) => new URL(e.url).pathname || "/");
    return Array.from(new Set([...INDEX_PATHS, ...paths]));
  } catch {
    return INDEX_PATHS;
  }
}

async function handle(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const paths = await allPaths();
  for (const path of paths) revalidatePath(path);

  // Same trigger, second audience: refreshing the cache is the moment we know
  // the content changed, so tell IndexNow too (260921-ed0). Every sitemap URL
  // goes in the ping, not just the index pages, so a new essay reaches Bing
  // within hours instead of waiting for a crawl. pingIndexNow never throws,
  // but the extra guard keeps a future refactor from breaking the response.
  try {
    await pingIndexNow(paths);
  } catch {}

  return NextResponse.json({
    revalidated: true,
    paths,
    indexnow: Boolean(process.env.INDEXNOW_KEY),
  });
}

export async function GET(request: NextRequest) {
  return handle(request);
}

export async function POST(request: NextRequest) {
  return handle(request);
}

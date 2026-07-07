import { type NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthorized } from "@/lib/enrich/auth";

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
const PATHS = ["/", "/writing", "/building", "/uses"];

function handle(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  for (const path of PATHS) revalidatePath(path);
  return NextResponse.json({ revalidated: true, paths: PATHS });
}

export async function GET(request: NextRequest) {
  return handle(request);
}

export async function POST(request: NextRequest) {
  return handle(request);
}

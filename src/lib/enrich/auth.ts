/**
 * Shared secret guard for the enrichment + revalidation routes.
 *
 * Accepts the token two ways so it works for both a bookmarkable link and a
 * Vercel cron:
 *  - `?token=<ENRICH_LOVES_TOKEN>` query param, or `Authorization: Bearer <token>`
 *  - `Authorization: Bearer <CRON_SECRET>` — Vercel attaches this to cron requests
 *    automatically when the CRON_SECRET env var is set, so vercel.json never has
 *    to embed the secret.
 */
export function isAuthorized(request: Request): boolean {
  const enrichToken = process.env.ENRICH_LOVES_TOKEN;
  const cronSecret = process.env.CRON_SECRET;

  const bearer = request.headers
    .get("authorization")
    ?.replace(/^Bearer\s+/i, "")
    .trim();

  let queryToken: string | null = null;
  try {
    queryToken = new URL(request.url).searchParams.get("token");
  } catch {
    queryToken = null;
  }

  if (enrichToken && (queryToken === enrichToken || bearer === enrichToken)) {
    return true;
  }
  if (cronSecret && bearer === cronSecret) {
    return true;
  }
  return false;
}

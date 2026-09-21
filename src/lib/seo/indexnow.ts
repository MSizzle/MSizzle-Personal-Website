import { SITE_URL, canonical } from './site'

const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow'

/**
 * Tell Bing and Yandex that a set of paths changed, instead of waiting for the
 * next crawl (260921-ed0). Sitemaps announce that a URL exists; IndexNow
 * announces that it changed, which is the faster of the two signals for a site
 * that publishes irregularly.
 *
 * Deliberately silent and deliberately un-awaitable in spirit: an indexing
 * ping must never take down the revalidate endpoint that calls it, so every
 * failure path (no key, network error, non-200, timeout) ends in a console
 * warning and a resolved promise. Never throws.
 */
export async function pingIndexNow(paths: string[]): Promise<void> {
  const key = process.env.INDEXNOW_KEY
  if (!key) return
  if (paths.length === 0) return

  try {
    const host = new URL(SITE_URL).host
    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host,
        key,
        keyLocation: `${SITE_URL}/indexnow-key.txt`,
        urlList: paths.map((p) => canonical(p)),
      }),
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) {
      console.warn(`IndexNow ping returned ${res.status}`)
    }
  } catch (err) {
    console.warn('IndexNow ping failed', err)
  }
}

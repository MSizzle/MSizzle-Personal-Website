/**
 * fetch with a small backoff on transient throttling (429) and unavailability
 * (503). Keeps the keyless public APIs (Google Books, Wikipedia) usable when
 * they briefly rate-limit; providers still fall back / return null on failure.
 */
export async function fetchRetry(
  url: string,
  init?: RequestInit,
  retries = 2
): Promise<Response> {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(url, init);
    if ((res.status === 429 || res.status === 503) && attempt < retries) {
      await new Promise((r) => setTimeout(r, 600 * (attempt + 1)));
      continue;
    }
    return res;
  }
}

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://montysinger.com'

/**
 * The one sentence that describes Monty, used verbatim in the root meta
 * description, the Person node's `description`, /llms.txt and the /about hero.
 * Search engines and language models reward one consistent claim over five
 * paraphrases, so this string has exactly one home (quick task 260921-ed0).
 * No em dashes, no location, no employers beyond Prometheus.
 */
export const IDENTITY_SENTENCE =
  'Monty Singer is the founder of Prometheus, an applied AI company. Builder, writer, and doer.'

/**
 * Stable @id for the Person entity. Every JSON-LD reference to Monty (WebSite
 * publisher, BlogPosting author, Organization founder, project author) points
 * here so crawlers merge them into one node instead of several look-alikes.
 */
export const PERSON_ID = `${SITE_URL}/#person`

/** Stable @id for Prometheus. Lives on the company's own origin, not ours. */
export const ORG_ID = 'https://prometheus.today/#organization'

/**
 * The root Open Graph image is the only stable portrait asset this site
 * serves, so it doubles as the Person node's `image`.
 */
export const PERSON_IMAGE = `${SITE_URL}/opengraph-image`

export function canonical(path: string = '/'): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  // The homepage is referenced three ways (canonical tag, sitemap <loc>,
  // breadcrumb JSON-LD `item`). The first two render bare, but canonical('/')
  // used to append the slash and emit `https://montysinger.com/`, so the
  // breadcrumb disagreed with the other two about the homepage's URL
  // (260728-kcg). Collapse the root to the bare form everything else uses.
  if (normalized === '/') return SITE_URL
  return `${SITE_URL}${normalized}`
}

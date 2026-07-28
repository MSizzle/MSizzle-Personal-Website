export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://montysinger.com'

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

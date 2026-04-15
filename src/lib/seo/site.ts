export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://montysinger.com'

export function canonical(path: string = '/'): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${SITE_URL}${normalized}`
}

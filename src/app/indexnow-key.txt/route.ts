export const dynamic = 'force-dynamic'

/**
 * IndexNow proves ownership by asking the site to serve its own key as a plain
 * text file. This lives outside /api on purpose: robots.txt disallows /api/,
 * and a key file a crawler cannot read is a key file that does not work
 * (260921-ed0). 404s until INDEXNOW_KEY is set.
 */
export async function GET() {
  const key = process.env.INDEXNOW_KEY
  if (!key) {
    return new Response('Not found', {
      status: 404,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  }
  return new Response(key, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}

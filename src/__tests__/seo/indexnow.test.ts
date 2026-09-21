/**
 * IndexNow plumbing (260921-ed0). The contract that matters: the ping is
 * optional, silent, and can never take down the caller.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { pingIndexNow } from '@/lib/seo/indexnow'

const fetchMock = vi.fn(async () => ({ ok: true, status: 200 }) as unknown as Response)

beforeEach(() => {
  fetchMock.mockClear()
  vi.stubGlobal('fetch', fetchMock)
  vi.spyOn(console, 'warn').mockImplementation(() => {})
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('pingIndexNow', () => {
  it('does nothing when INDEXNOW_KEY is unset', async () => {
    vi.stubEnv('INDEXNOW_KEY', '')
    await pingIndexNow(['/'])
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('posts host, key, keyLocation and absolute URLs when the key is set', async () => {
    vi.stubEnv('INDEXNOW_KEY', 'abc123')
    await pingIndexNow(['/', '/writing'])

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
    expect(url).toBe('https://api.indexnow.org/indexnow')
    expect(init.method).toBe('POST')

    const body = JSON.parse(init.body as string)
    expect(body.host).toBe('montysinger.com')
    expect(body.key).toBe('abc123')
    expect(body.keyLocation).toBe('https://montysinger.com/indexnow-key.txt')
    expect(body.urlList).toEqual([
      'https://montysinger.com',
      'https://montysinger.com/writing',
    ])
  })

  it('swallows a network failure instead of throwing at the caller', async () => {
    vi.stubEnv('INDEXNOW_KEY', 'abc123')
    fetchMock.mockRejectedValueOnce(new Error('offline') as never)
    await expect(pingIndexNow(['/'])).resolves.toBeUndefined()
  })
})

describe('GET /indexnow-key.txt', () => {
  it('404s while no key is configured', async () => {
    vi.stubEnv('INDEXNOW_KEY', '')
    const { GET } = await import('@/app/indexnow-key.txt/route')
    const res = await GET()
    expect(res.status).toBe(404)
  })

  it('serves the key as plain text once configured', async () => {
    vi.stubEnv('INDEXNOW_KEY', 'abc123')
    const { GET } = await import('@/app/indexnow-key.txt/route')
    const res = await GET()
    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toContain('text/plain')
    expect(await res.text()).toBe('abc123')
  })
})

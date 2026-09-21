import { describe, it, expect } from 'vitest'
import nextConfig from '../../../next.config'

describe('next.config redirects (260726-kjp)', () => {
  it('/watching redirects to /#loves, not the deleted /uses route', async () => {
    const redirects = await nextConfig.redirects!()
    const watching = redirects.find((r) => r.source === '/watching')
    expect(watching).toBeDefined()
    expect(watching!.destination).toBe('/#loves')
    expect(watching!.permanent).toBe(true)
  })

  it('no redirect entry points at the deleted /uses route', async () => {
    const redirects = await nextConfig.redirects!()
    expect(redirects.some((r) => r.destination === '/uses')).toBe(false)
  })
})

describe('next.config redirects (260921-ed0)', () => {
  it('/about is a real page again, so nothing redirects away from it', async () => {
    const redirects = await nextConfig.redirects!()
    expect(redirects.some((r) => r.source === '/about')).toBe(false)
  })

  it('/links lands on /about', async () => {
    const redirects = await nextConfig.redirects!()
    const links = redirects.find((r) => r.source === '/links')
    expect(links?.destination).toBe('/about')
  })
})

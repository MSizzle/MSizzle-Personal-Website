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

import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

vi.mock('@/components/animations/scroll-reveal', () => ({
  ScrollReveal: ({ children }: any) => <>{children}</>,
}))

describe('Links Page outbound tracking (D-11)', () => {
  it('renders data-umami-event on external links only', async () => {
    const LinksPage = (await import('@/app/links/page')).default
    const { container } = render(<LinksPage />)
    const trackedLinks = container.querySelectorAll('a[data-umami-event]')
    // Only http:// links get tracked (twitter, linkedin, github), not mailto or /blog
    expect(trackedLinks.length).toBe(3)
    const eventNames = Array.from(trackedLinks).map(l => l.getAttribute('data-umami-event'))
    expect(eventNames).toContain('links-click-linkedin')
    expect(eventNames).toContain('links-click-github')
  })
})

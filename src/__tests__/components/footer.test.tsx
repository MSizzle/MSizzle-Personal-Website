import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Footer } from '@/components/footer'

describe('Footer outbound tracking (D-11)', () => {
  it('renders data-umami-event on social links', () => {
    const { container } = render(<Footer />)
    const links = container.querySelectorAll('a[data-umami-event]')
    expect(links.length).toBe(4) // email, twitter, linkedin, github
    const eventNames = Array.from(links).map(l => l.getAttribute('data-umami-event'))
    expect(eventNames).toContain('social-click-email')
    expect(eventNames).toContain('social-click-linkedin')
    expect(eventNames).toContain('social-click-github')
  })
})

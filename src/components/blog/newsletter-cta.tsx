'use client'

import { useState } from 'react'

export function NewsletterCta() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    console.log('Newsletter signup:', email)
    setStatus('success')
  }

  return (
    <section className="mt-16 border-t border-[var(--border)] pt-8">
      <h3 className="text-sm font-normal uppercase tracking-widest">
        Stay in the Loop
      </h3>
      <p className="mt-2 opacity-50">
        Get new posts delivered to your inbox. No spam, ever.
      </p>

      {status === 'success' && (
        <p className="mt-4 text-sm">
          You&apos;re in. Talk soon.
        </p>
      )}

      {status === 'error' && (
        <p className="mt-4 text-sm">
          Something went wrong. Try again or email me directly.
        </p>
      )}

      {status === 'idle' && (
        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="flex-1 border-b border-[var(--border)] bg-transparent px-0 py-2 text-base outline-none transition-opacity placeholder:opacity-30 focus:border-[var(--fg)]"
          />
          <button
            type="submit"
            className="border-b border-[var(--border)] px-2 py-2 text-base transition-opacity hover:opacity-60"
          >
            Subscribe
          </button>
        </form>
      )}
    </section>
  )
}

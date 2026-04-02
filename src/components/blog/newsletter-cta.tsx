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
    <section className="mt-16 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-8">
      <h3 className="text-xl font-semibold">Stay in the Loop</h3>
      <p className="mt-2 text-sm text-[var(--fg-muted)]">
        Get new posts delivered to your inbox. No spam, ever.
      </p>

      {status === 'success' && (
        <p className="mt-4 text-sm text-[var(--accent)]">
          You&apos;re in. Talk soon.
        </p>
      )}

      {status === 'error' && (
        <p className="mt-4 text-sm text-red-500">
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
            className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-2 text-sm outline-none focus:border-[var(--accent)] transition-colors"
          />
          <button
            type="submit"
            className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Get Posts by Email
          </button>
        </form>
      )}
    </section>
  )
}

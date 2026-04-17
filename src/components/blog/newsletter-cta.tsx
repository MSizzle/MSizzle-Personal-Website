import Link from 'next/link'

export function NewsletterCta() {
  return (
    <section className="mt-16 border-t border-[var(--border)] pt-8">
      <h3 className="text-sm font-normal uppercase tracking-widest">
        Monty Monthly
      </h3>
      <p className="mt-2 opacity-75">
        Essays on AI, entrepreneurship, philosophy, and building. Delivered monthly.
      </p>
      <a
        href="https://montymonthly.substack.com"
        target="_blank"
        rel="noopener noreferrer"
        data-umami-event="newsletter-cta-click"
        className="mt-4 inline-block border border-[var(--border)] px-5 py-2.5 text-sm uppercase tracking-widest transition-opacity hover:opacity-60"
      >
        Subscribe &rarr;
      </a>
    </section>
  )
}

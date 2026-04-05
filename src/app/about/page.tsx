import type { Metadata } from 'next'
import { Timeline } from '@/components/about/timeline'
import { TIMELINE_EVENTS } from '@/data/timeline'

export const metadata: Metadata = {
  title: 'About — Monty Singer',
  description: 'Background, education, career, and interests of Monty Singer.',
}

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Monty Singer',
  url: 'https://msizzle.com',
  sameAs: [
    'https://x.com/thefullmonty0',
    'https://linkedin.com/in/monty-singer',
    'https://github.com/MSizzle',
  ],
  jobTitle: 'Investor',
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'Georgetown University',
  },
  description: 'Investor, builder, and lifelong learner based in NYC.',
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 pb-16 pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        About Me
      </h1>
      <p className="mt-3 text-base text-[var(--fg-muted)]">
        Investor, builder, and lifelong learner based in NYC. Georgetown grad working
        at the intersection of technology and finance.
      </p>

      <h2 className="mt-10 text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
        Timeline
      </h2>
      <p className="mt-1 text-sm text-[var(--fg-muted)]">
        Click an icon to learn more about each experience.
      </p>

      <div className="mt-6">
        <Timeline events={TIMELINE_EVENTS} />
      </div>
    </div>
  )
}

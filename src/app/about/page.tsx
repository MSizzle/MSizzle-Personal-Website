import type { Metadata } from 'next'

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
    <div className="mx-auto max-w-[66ch] px-6 pb-16 pt-24 md:px-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      <h1 className="text-sm font-normal uppercase tracking-widest">
        About
      </h1>

      <div className="prose mt-8 max-w-none">
        <p>
          I&apos;m Monty Singer — an investor, builder, and perpetual student based in New York City.
          I spend my time at the intersection of technology and finance, always looking for what&apos;s
          next and trying to build things that matter.
        </p>

        <h2>Education</h2>
        <p>
          I studied at Georgetown University in Washington, D.C., where I developed a foundation in
          analytical thinking and a deep curiosity about how systems work — from markets to technology
          to organizations.
        </p>

        <h2>Career</h2>
        <p>
          My career has centered on investing — understanding businesses, evaluating opportunities,
          and making decisions under uncertainty. More recently, I&apos;ve been channeling that same
          energy into building. Whether it&apos;s software tools, content, or experiments with AI, I
          believe the best way to understand something is to create it.
        </p>

        <h2>Outside of Work</h2>
        <p>
          Reading constantly, exploring NYC, and finding new rabbit holes to dive into. This site is
          one of those projects — a place to share what I&apos;m learning and building.
        </p>
      </div>
    </div>
  )
}

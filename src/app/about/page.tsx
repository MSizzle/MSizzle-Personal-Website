import type { Metadata } from 'next'
import { ScrollReveal } from '@/components/animations/scroll-reveal'

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
    'https://twitter.com/msizzle',
    'https://linkedin.com/in/montysinger',
    'https://github.com/montysinger',
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
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      <ScrollReveal delay={0}>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
          About Me
        </h1>
      </ScrollReveal>

      <ScrollReveal delay={0.15}>
        <div className="prose prose-neutral dark:prose-invert mt-12 max-w-none">
          <p>
            I&apos;m Monty Singer — an investor, builder, and perpetual student based in New York City.
            I spend my time at the intersection of technology and finance, always looking for what&apos;s
            next and trying to build things that matter.
          </p>

          <h2>Education</h2>
          <p>
            I studied at Georgetown University in Washington, D.C., where I developed a foundation in
            analytical thinking and a deep curiosity about how systems work — from markets to technology
            to organizations. The experience shaped how I approach problems: with rigor, but also with
            an openness to unconventional ideas.
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.3}>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>Career</h2>
          <p>
            My career has centered on investing — understanding businesses, evaluating opportunities,
            and making decisions under uncertainty. Based in NYC, I work across the investment
            landscape, combining quantitative analysis with a builder&apos;s mindset.
          </p>
          <p>
            More recently, I&apos;ve been channeling that same energy into building. Whether it&apos;s
            software tools, content, or experiments with AI, I believe the best way to understand
            something is to create it.
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.45}>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>Skills &amp; Interests</h2>
          <p>
            I&apos;m drawn to the space where technology meets real-world impact. My toolkit spans
            financial analysis, software development (with heavy AI assistance), and a growing comfort
            with the full stack of modern web development.
          </p>
          <p>
            Outside of work, I&apos;m reading constantly, exploring NYC, and finding new rabbit holes
            to dive into. This site is one of those projects — a place to share what I&apos;m learning
            and building.
          </p>
        </div>
      </ScrollReveal>
    </div>
  )
}

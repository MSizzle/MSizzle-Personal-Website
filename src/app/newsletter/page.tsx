import Image from 'next/image'
import type { Metadata } from 'next'
import { fetchMontyMonthlyIssues } from '@/lib/rss/substack'
import { PageHero } from '@/components/v3/page-hero'
import { RuleStrong } from '@/components/editorial/rule-strong'
import { SectionLabel } from '@/components/editorial/section-label'

export const revalidate = 86400 // 24h

export const metadata: Metadata = {
  title: 'Monty Monthly | Newsletter by Monty Singer',
  description:
    'Monty Monthly is a newsletter by Monty Singer covering AI, entrepreneurship, philosophy, and building in public. Subscribe on Substack.',
  alternates: { canonical: '/newsletter' },
  openGraph: {
    title: 'Monty Monthly | Newsletter by Monty Singer',
    description:
      'Monty Monthly is a newsletter by Monty Singer covering AI, entrepreneurship, philosophy, and building in public. Subscribe on Substack.',
    url: '/newsletter',
    type: 'website',
  },
}

export default async function NewsletterPage() {
  const issues = await fetchMontyMonthlyIssues(20)

  return (
    <>
      <section className="px-6 md:px-40">
        <PageHero
          title="Newsletter"
          crumb="Home / Newsletter"
          sub="Monty Monthly -- a monthly dispatch."
        />
        <div className="pb-12">
          <a
            href="https://montymonthly.substack.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border border-[var(--color-text)] px-7 py-3 text-label uppercase text-[var(--color-text)] transition-opacity hover:opacity-80 no-underline"
          >
            Subscribe on Substack &rarr;
          </a>
        </div>
      </section>

      <RuleStrong />

      <section className="px-6 pt-[120px] pb-[120px] md:px-40">
        <SectionLabel numeral="02 -- Issues">Recent Issues</SectionLabel>

        <div className="mt-[72px]">
          {issues.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {issues.map((issue) => (
                <a
                  key={issue.link}
                  href={issue.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block bg-[var(--color-bg-2)] border border-[var(--color-border)] no-underline"
                >
                  {issue.thumbnail ? (
                    <div className="relative aspect-[4/5] md:aspect-[16/9] overflow-hidden bg-[var(--color-surface)]">
                      <Image
                        src={issue.thumbnail}
                        alt={issue.title}
                        fill
                        sizes="(max-width: 768px) 50vw, 33vw"
                        className="object-cover saturate-[0.92]"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[4/5] md:aspect-[16/9] bg-[var(--color-surface)]" aria-hidden />
                  )}
                  <div className="p-4">
                    <h3 className="text-list-title text-[var(--color-text)]">{issue.title}</h3>
                    <time className="mt-2 block text-meta uppercase text-[var(--color-text-muted)]">
                      {new Date(issue.pubDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        timeZone: 'UTC',
                      })}
                    </time>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-body text-[var(--color-text-muted)]">
              Issues land here once the archive syncs. In the meantime,{' '}
              <a
                href="https://montymonthly.substack.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline transition-opacity hover:opacity-60"
              >
                subscribe on Substack
              </a>{' '}
              to catch the next one.
            </p>
          )}
        </div>
      </section>

      <RuleStrong />
    </>
  )
}

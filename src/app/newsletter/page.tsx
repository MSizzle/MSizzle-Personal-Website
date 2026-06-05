import type { Metadata } from 'next'
import Image from 'next/image'
import { fetchMontyMonthlyIssues } from '@/lib/rss/substack'
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
      <section className="px-6 pt-16 pb-15 md:px-40 md:pt-40 md:pb-25">
        <div className="grid grid-cols-1 items-end gap-10 md:grid-cols-[1fr_360px] md:gap-20">
          <div>
            <div className="text-label uppercase text-muted">── The Dispatch · 02</div>
            <h1 className="mt-6 text-page-title uppercase text-ink">Monty Monthly.</h1>
            <p className="mt-10 max-w-[35rem] text-body-lead text-muted">
              A monthly letter on what I&rsquo;m building, learning, and thinking
              about — essays on AI, entrepreneurship, philosophy, and life. One
              email a month, no firehose.
            </p>
            <a
              href="https://montymonthly.substack.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-block border border-ink px-7 py-3 text-label uppercase text-ink transition-opacity hover:opacity-80 no-underline"
            >
              Subscribe on Substack &rarr;
            </a>
          </div>
          <div className="hidden md:block">
            <div className="relative h-[480px] w-[360px] overflow-hidden bg-rule-strong">
              <Image
                src="/MSizzle-website-photos/IMG_0028.jpeg"
                alt=""
                fill
                sizes="360px"
                className="object-cover saturate-[0.92]"
              />
            </div>
          </div>
        </div>
      </section>

      <RuleStrong />

      <section className="px-6 pt-[120px] pb-[120px] md:px-40">
        <SectionLabel numeral="02 — Issues">Recent Issues</SectionLabel>

        <div className="mt-[72px]">
          {issues.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {issues.map((issue) => (
                <a
                  key={issue.link}
                  href={issue.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block bg-paper border border-rule no-underline"
                >
                  {issue.thumbnail ? (
                    <div className="relative aspect-[4/5] md:aspect-[16/9] overflow-hidden bg-muted">
                      <Image
                        src={issue.thumbnail}
                        alt={issue.title}
                        fill
                        sizes="(max-width: 768px) 50vw, 33vw"
                        className="object-cover saturate-[0.92]"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[4/5] md:aspect-[16/9] bg-muted" aria-hidden />
                  )}
                  <div className="p-4">
                    <h3 className="text-list-title text-ink">{issue.title}</h3>
                    <time className="mt-2 block text-meta uppercase text-muted">
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
            <p className="text-body text-muted">
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

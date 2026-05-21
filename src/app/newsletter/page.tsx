import type { Metadata } from 'next'
import Image from 'next/image'
import { Breadcrumbs } from '@/components/seo/breadcrumbs'
import { fetchMontyMonthlyIssues } from '@/lib/rss/substack'

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
      <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Monty Monthly' }]} />

      {/* Intro column — stays in max-w-[66ch] reading column */}
      <div className="mx-auto max-w-[66ch] px-6 pt-8 pb-8 md:px-0">
        <h1 className="text-section-feature text-ink uppercase">Monty Monthly</h1>

        <div className="prose mt-8 max-w-none">
          <p>
            Monty Monthly is a monthly newsletter covering what I&rsquo;m building,
            learning, and thinking about. Essays on AI, entrepreneurship, philosophy,
            and life.
          </p>
        </div>

        <a
          href="https://montymonthly.substack.com"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block border border-ink px-7 py-3 text-label uppercase text-ink transition-opacity hover:opacity-80 no-underline"
        >
          Subscribe on Substack &rarr;
        </a>
      </div>

      {/* Issue gallery — breaks out to full editorial page width */}
      {issues.length > 0 ? (
        <section className="px-6 pb-16 md:px-40">
          <div className="text-label uppercase text-muted mb-4">Recent Issues</div>
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
        </section>
      ) : (
        <section className="px-6 pb-16 md:px-40">
          <p className="text-muted">
            Recent issues coming soon. In the meantime,{' '}
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
        </section>
      )}
    </>
  )
}

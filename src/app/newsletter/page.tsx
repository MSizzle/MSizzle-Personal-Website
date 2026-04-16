import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/seo/breadcrumbs'
import { NewsletterCarousel } from '@/components/newsletter/newsletter-carousel'
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
  const issues = await fetchMontyMonthlyIssues(10)

  return (
    <>
      <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Monty Monthly' }]} />

      <article className="mx-auto max-w-[66ch] px-6 pt-8 pb-16 md:px-0">
        <h1 className="text-2xl font-normal tracking-tight sm:text-3xl">Monty Monthly</h1>

        <div className="prose mt-8 max-w-none">
          <p>
            Monty Monthly is a monthly newsletter covering what I&rsquo;m building,
            learning, and thinking about. Essays on AI, entrepreneurship, philosophy,
            and life.
          </p>
          <a
            href="https://montymonthly.substack.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block rounded-lg border border-[var(--accent)] bg-[var(--accent)] px-6 py-3 text-base font-normal text-white no-underline shadow-md transition-all hover:shadow-lg hover:brightness-110"
          >
            Subscribe on Substack &rarr;
          </a>
        </div>

        {issues.length > 0 ? (
          <section className="mt-12">
            <h2 className="text-sm font-normal uppercase tracking-widest">Recent Issues</h2>
            <div className="mt-4">
              <NewsletterCarousel issues={issues} />
            </div>
          </section>
        ) : (
          <section className="mt-12">
            <p className="opacity-70">
              Recent issues coming soon. In the meantime,{' '}
              <a
                href="https://montymonthly.substack.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                subscribe on Substack
              </a>{' '}
              to catch the next one.
            </p>
          </section>
        )}
      </article>
    </>
  )
}

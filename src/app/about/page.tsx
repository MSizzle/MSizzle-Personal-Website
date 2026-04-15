import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/seo/breadcrumbs'

export const metadata: Metadata = {
  title: 'About | Monty Singer',
  description:
    'Monty Singer is the founder of Prometheus, an AI integrations and education company. He builds software, writes essays, and publishes Monty Monthly.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About | Monty Singer',
    description:
      'Monty Singer is the founder of Prometheus, an AI integrations and education company. He builds software, writes essays, and publishes Monty Monthly.',
    url: '/about',
    type: 'profile',
  },
}

export default function AboutPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'About' }]} />

      <div className="mx-auto max-w-[66ch] px-6 pt-8 pb-16 md:px-0">
        <h1 className="text-sm font-normal uppercase tracking-widest">About</h1>

        <div className="prose mt-8 max-w-none">
          <p>
            I&rsquo;m Monty Singer, founder of Prometheus. I build AI tools, write
            essays, and publish a monthly newsletter called Monty Monthly.
          </p>

          <h2>Prometheus</h2>
          <p>
            <a href="https://prometheus.today" target="_blank" rel="noopener noreferrer">Prometheus</a>{' '}
            is an AI integrations and education company. We help businesses implement AI
            tools, build custom automations, and understand how to use AI effectively.
          </p>

          <h2>Writing</h2>
          <p>
            I write <a href="/blog">essays on philosophy, technology, and life</a>, and
            publish <a href="https://montymonthly.substack.com" target="_blank" rel="noopener noreferrer">Monty Monthly</a>,
            a monthly newsletter on what I&rsquo;m building, learning, and thinking about.
          </p>

          <h2>Education</h2>
          <p>Georgetown University.</p>
        </div>
      </div>
    </>
  )
}

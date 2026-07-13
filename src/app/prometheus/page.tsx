import type { Metadata } from 'next'
import { PageHero } from '@/components/v3/page-hero'
import { JsonLd } from '@/components/seo/json-ld'
import { buildFaqPageSchema } from '@/lib/seo/schemas'
import { RuleStrong } from '@/components/editorial/rule-strong'
import { Rule } from '@/components/editorial/rule'

export const metadata: Metadata = {
  title: 'Prometheus | AI Integrations and Education',
  description:
    'Prometheus is an AI integrations and education company founded by Monty Singer. Custom automation, AI implementation, and training for businesses.',
  alternates: { canonical: '/prometheus' },
  openGraph: {
    title: 'Prometheus | AI Integrations and Education',
    description:
      'Prometheus is an AI integrations and education company founded by Monty Singer. Custom automation, AI implementation, and training for businesses.',
    url: '/prometheus',
    type: 'website',
  },
}

const FAQS = [
  {
    question: 'What does Prometheus do?',
    answer:
      'Prometheus helps eight and nine figure businesses make money, save resources, and leverage technology through custom automation pipelines, AI tool integration, and hands-on education and training.',
  },
  {
    question: 'Who is Prometheus for?',
    answer:
      'Prometheus works with small and mid-size businesses, professional services firms, and healthcare practices looking to integrate AI tools and automate repetitive workflows.',
  },
  {
    question: 'What kind of AI solutions does Prometheus build?',
    answer:
      'Prometheus builds custom automation pipelines, AI-powered document processing tools, email and communication agents, workflow automation, and provides AI education and training for teams.',
  },
  {
    question: 'Who founded Prometheus?',
    answer: 'Prometheus was founded by Monty Singer in 2026.',
  },
]

export default function PrometheusPage() {
  return (
    <>
      <JsonLd data={buildFaqPageSchema(FAQS)} />

      <section className="px-6 md:px-40">
        <PageHero
          title="Prometheus"
          crumb="Home / Prometheus"
          sub="Applied AI"
        />
      </section>

      <RuleStrong />

      <section className="px-6 pt-[120px] pb-[120px] md:px-40">
        {/* What I Do row */}
        <div className="grid grid-cols-1 gap-6 py-9 md:grid-cols-[180px_1fr_1fr] md:gap-12">
          <div className="text-meta uppercase text-[var(--color-text-muted)]">Services</div>
          <div className="text-feature text-[var(--color-text)]">What I Do</div>
          <div className="text-body text-[var(--color-text)]">
            <p>
              We automate workflows to save businesses time and money, advise
              enterprises on internal AI adoption to answer the big questions,
              and serve as an AI-enabled partner for your enterprise.
            </p>
          </div>
        </div>

        <Rule />

        {/* Orthodontic practice row */}
        <div className="grid grid-cols-1 gap-6 py-9 md:grid-cols-[180px_1fr_1fr] md:gap-12">
          <div className="text-meta uppercase text-[var(--color-text-muted)]">Case Study · Healthcare</div>
          <div className="text-feature text-[var(--color-text)]">Document Automation</div>
          <div className="text-body text-[var(--color-text)]">
            <p>
              An orthodontic practice was rebuilding the same patient slide decks
              by hand every week. We built a pipeline that turns their PDF reports
              into finished PowerPoint presentations automatically. It runs
              locally, stays HIPAA-compliant, and gives back hours every week.
            </p>
          </div>
        </div>

        <Rule />

        {/* Hospitality company row */}
        <div className="grid grid-cols-1 gap-6 py-9 md:grid-cols-[180px_1fr_1fr] md:gap-12">
          <div className="text-meta uppercase text-[var(--color-text-muted)]">Case Study · Hospitality</div>
          <div className="text-feature text-[var(--color-text)]">Research Tooling</div>
          <div className="text-body text-[var(--color-text)]">
            <p>
              A boutique hospitality chain needed to research properties faster
              and publish without the busywork. We scoped and designed a custom
              research tool and website for their rental business, with content
              workflows that run themselves.
            </p>
          </div>
        </div>

        <Rule />

        {/* Work with Prometheus row */}
        <div className="grid grid-cols-1 gap-6 py-9 md:grid-cols-[180px_1fr_1fr] md:gap-12">
          <div className="text-meta uppercase text-[var(--color-text-muted)]">Contact</div>
          <div className="text-feature text-[var(--color-text)]">Start a project</div>
          <div className="text-body text-[var(--color-text)]">
            <p>
              The full story lives at prometheus.today. If you have a workflow
              that should run itself, email me and we will scope it.
            </p>
            <div className="mt-4 flex flex-wrap gap-6">
              <a
                href="https://prometheus.today"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block border-b border-[var(--color-text)] pb-1 text-label uppercase text-[var(--color-text)]"
              >
                prometheus.today &rarr;
              </a>
              <a
                href="mailto:info@prometheus.today"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block border-b border-[var(--color-text)] pb-1 text-label uppercase text-[var(--color-text)]"
              >
                info@prometheus.today &rarr;
              </a>
              <a
                href="https://x.com/themontysinger"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block border-b border-[var(--color-text)] pb-1 text-label uppercase text-[var(--color-text)]"
              >
                @themontysinger &rarr;
              </a>
            </div>
          </div>
        </div>
      </section>

      <RuleStrong />
    </>
  )
}

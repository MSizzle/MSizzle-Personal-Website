import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/seo/breadcrumbs'
import { JsonLd } from '@/components/seo/json-ld'
import { buildFaqPageSchema } from '@/lib/seo/schemas'

export const metadata: Metadata = {
  title: 'Prometheus | AI Integrations and Education | Monty Singer',
  description:
    'Prometheus is an AI integrations and education company founded by Monty Singer. Custom automation, AI implementation, and training for businesses.',
  alternates: { canonical: '/prometheus' },
  openGraph: {
    title: 'Prometheus | AI Integrations and Education | Monty Singer',
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
      'Prometheus helps businesses implement AI into their workflows through custom automation pipelines, AI tool integration, and hands-on education and training.',
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
      <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Prometheus' }]} />
      <JsonLd data={buildFaqPageSchema(FAQS)} />

      <article className="mx-auto max-w-[66ch] px-6 pt-8 pb-16 md:px-0">
        <h1 className="text-2xl font-normal tracking-tight sm:text-3xl">Prometheus</h1>
        <p className="mt-2 text-sm uppercase tracking-widest opacity-50">
          AI Integrations and Education
        </p>

        <div className="prose mt-8 max-w-none">
          <p>
            Prometheus helps businesses implement AI into their workflows. From custom
            automation pipelines to hands-on AI education, Prometheus bridges the gap
            between what AI can do and what businesses actually need. Founded by Monty
            Singer.
          </p>

          <h2>What We Do</h2>
          <ul>
            <li>Custom AI automation pipelines</li>
            <li>AI tool implementation and integration</li>
            <li>AI education and training for teams</li>
            <li>Workflow optimization with AI</li>
          </ul>

          <h2>Case Studies</h2>
          <p>
            <strong>An orthodontic practice.</strong> Built an automated pipeline that
            converts patient PDF reports into formatted PowerPoint presentations,
            eliminating hours of manual work per week. HIPAA-compliant local architecture.
          </p>
          <p>
            <strong>A boutique hospitality company.</strong> Scoped and designed a custom
            research tool and website for a property rental business, including automated
            content workflows.
          </p>

          <h2>Work with Prometheus</h2>
          <p>
            Visit{' '}
            <a href="https://prometheus.today" target="_blank" rel="noopener noreferrer">
              prometheus.today
            </a>{' '}
            to learn more, or{' '}
            <a href="mailto:mds345@georgetown.edu">get in touch</a>{' '}
            to discuss a project.
          </p>
        </div>
      </article>
    </>
  )
}

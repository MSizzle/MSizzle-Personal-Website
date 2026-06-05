import type { Metadata } from 'next'
import Image from 'next/image'
import { JsonLd } from '@/components/seo/json-ld'
import { buildFaqPageSchema } from '@/lib/seo/schemas'
import { RuleStrong } from '@/components/editorial/rule-strong'
import { Rule } from '@/components/editorial/rule'
import { AllLink } from '@/components/editorial/all-link'

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
      <JsonLd data={buildFaqPageSchema(FAQS)} />

      <section className="px-6 pt-16 pb-15 md:px-40 md:pt-40 md:pb-25">
        <div className="grid grid-cols-1 items-end gap-10 md:grid-cols-[1fr_360px] md:gap-20">
          <div>
            <div className="text-label uppercase text-muted">── The Studio · 01</div>
            <h1 className="mt-6 text-page-title uppercase text-ink">Prometheus.</h1>
            <p className="mt-10 max-w-[35rem] text-body-lead text-muted">
              AI integrations and education. I help businesses implement AI into
              their workflows — custom automation pipelines, tool integration,
              and hands-on training. Built to outlive the next platform shift.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="relative h-[480px] w-[360px] overflow-hidden bg-rule-strong">
              <Image
                src="/MSizzle-website-photos/000092530012.jpeg"
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
        {/* What I Do row */}
        <div className="grid grid-cols-1 gap-6 py-9 md:grid-cols-[180px_1fr_1fr] md:gap-12">
          <div className="text-meta uppercase text-muted">Services</div>
          <div className="text-feature text-ink">What I Do</div>
          <div className="text-body text-ink">
            <p>
              Custom AI automation pipelines; AI tool implementation and
              integration; AI education and training for teams; workflow
              optimization with AI.
            </p>
          </div>
        </div>

        <Rule />

        {/* Orthodontic practice row */}
        <div className="grid grid-cols-1 gap-6 py-9 md:grid-cols-[180px_1fr_1fr] md:gap-12">
          <div className="text-meta uppercase text-muted">Case Study · Healthcare</div>
          <div className="text-feature text-ink">Document Automation</div>
          <div className="text-body text-ink">
            <p>
              An orthodontic practice. Built an automated pipeline that converts
              patient PDF reports into formatted PowerPoint presentations,
              eliminating hours of manual work per week. HIPAA-compliant local
              architecture.
            </p>
          </div>
        </div>

        <Rule />

        {/* Hospitality company row */}
        <div className="grid grid-cols-1 gap-6 py-9 md:grid-cols-[180px_1fr_1fr] md:gap-12">
          <div className="text-meta uppercase text-muted">Case Study · Hospitality</div>
          <div className="text-feature text-ink">Research Tooling</div>
          <div className="text-body text-ink">
            <p>
              A boutique hospitality company. Scoped and designed a custom
              research tool and website for a property rental business,
              including automated content workflows.
            </p>
          </div>
        </div>

        <Rule />

        {/* Work with Prometheus row */}
        <div className="grid grid-cols-1 gap-6 py-9 md:grid-cols-[180px_1fr_1fr] md:gap-12">
          <div className="text-meta uppercase text-muted">Contact</div>
          <div className="text-feature text-ink">Start a project</div>
          <div className="text-body text-ink">
            <p>
              Visit prometheus.today to learn more, or email to discuss a
              project.
            </p>
            <div className="mt-4 flex flex-wrap gap-6">
              <AllLink href="https://prometheus.today">prometheus.today &rarr;</AllLink>
              <AllLink href="mailto:monty@prometheus.today">monty@prometheus.today &rarr;</AllLink>
            </div>
          </div>
        </div>
      </section>

      <RuleStrong />
    </>
  )
}

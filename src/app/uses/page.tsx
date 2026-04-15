import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/seo/breadcrumbs'

export const metadata: Metadata = {
  title: 'Uses | Tools and Stack | Monty Singer',
  description:
    'The tools, software, and tech stack Monty Singer uses for AI development, writing, and building Prometheus.',
  alternates: { canonical: '/uses' },
  openGraph: {
    title: 'Uses | Tools and Stack | Monty Singer',
    description:
      'The tools, software, and tech stack Monty Singer uses for AI development, writing, and building Prometheus.',
    url: '/uses',
    type: 'website',
  },
}

export default function UsesPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Uses' }]} />

      <article className="mx-auto max-w-[66ch] px-6 pt-8 pb-16 md:px-0">
        <h1 className="text-2xl font-normal tracking-tight sm:text-3xl">What I Use</h1>

        <div className="prose mt-8 max-w-none">
          <p>
            The tools I reach for most often, across building Prometheus, writing, and
            everything else.
          </p>

          <h2>AI and Development</h2>
          <ul>
            <li><strong>Claude</strong>: primary thinking partner for writing and planning.</li>
            <li><strong>Claude Code</strong>: pair-programming harness for almost every coding session.</li>
            <li><strong>LangGraph</strong>: orchestration for multi-step agent workflows.</li>
            <li><strong>Ollama</strong>: local model runtime for HIPAA-sensitive Prometheus pipelines.</li>
            <li><strong>Python</strong>: default language for automation and data tools.</li>
            <li><strong>Next.js</strong>: framework for this site and most web projects.</li>
            <li><strong>React</strong>: UI layer, paired with TypeScript.</li>
            <li><strong>Node.js</strong>: runtime for web backends and scripts.</li>
            <li><strong>DigitalOcean</strong>: cheap boxes for long-running jobs.</li>
            <li><strong>Vercel</strong>: hosting for everything public-facing.</li>
            <li><strong>GitHub</strong>: source of truth for every project.</li>
          </ul>

          <h2>Productivity</h2>
          <ul>
            <li><strong>Obsidian</strong>: my second brain. Daily journaling, wikilinked notes, and a custom voice-memo-to-markdown pipeline.</li>
            <li><strong>Substack</strong>: home of Monty Monthly.</li>
            <li><strong>Notion</strong>: project management and content for this site.</li>
          </ul>

          <h2>Communication</h2>
          <ul>
            <li><strong>Telegram</strong>: async chats, daily weather bot, and other personal bots.</li>
            <li><strong>Slack</strong>: team collaboration on shared projects.</li>
          </ul>

          <h2>Hardware</h2>
          <p className="opacity-60">
            <em>Placeholder: laptop, phone, and desk setup to be filled in.</em>
          </p>
        </div>
      </article>
    </>
  )
}

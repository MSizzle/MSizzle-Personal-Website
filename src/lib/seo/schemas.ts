import { SITE_URL, canonical } from './site'

export function buildPersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Monty Singer',
    url: SITE_URL,
    jobTitle: 'Founder',
    worksFor: {
      '@type': 'Organization',
      name: 'Prometheus',
      url: 'https://prometheus.today',
    },
    sameAs: [
      'https://linkedin.com/in/monty-singer',
      'https://github.com/MSizzle',
      'https://x.com/thefullmonty0',
    ],
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'Georgetown University',
    },
  } as const
}

export type FaqItem = { question: string; answer: string }

export function buildFaqPageSchema(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: i.question,
      acceptedAnswer: { '@type': 'Answer', text: i.answer },
    })),
  }
}

export type BreadcrumbItem = { name: string; href?: string }

export function buildBreadcrumbListSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => {
      const node: Record<string, unknown> = {
        '@type': 'ListItem',
        position: idx + 1,
        name: item.name,
      }
      if (item.href) node.item = canonical(item.href)
      return node
    }),
  }
}

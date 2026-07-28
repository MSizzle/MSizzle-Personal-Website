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
      'https://x.com/themontysinger',
    ],
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'Georgetown University',
    },
  } as const
}

/**
 * Emitted once from the root layout. Names the site as an entity and ties it
 * back to the Person node, which is what lets Google treat montysinger.com and
 * "Monty Singer" as the same thing rather than two unrelated strings.
 */
export function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Monty Singer',
    url: SITE_URL,
    publisher: {
      '@type': 'Person',
      name: 'Monty Singer',
      url: SITE_URL,
    },
  } as const
}

export type BlogPostingInput = {
  title: string
  slug: string
  description: string
  /** Notion `Date` property, ISO. Empty when unset. */
  date?: string
  /** Notion page last_edited_time, ISO. */
  lastEdited?: string
  /** Notion page id; present only when the post has a cover image. */
  coverPageId?: string | null
  wordCount?: number
}

/**
 * Article markup for a post. Before this, posts emitted only BreadcrumbList --
 * no datePublished, author, or image, which are exactly the fields that earn a
 * date stamp and rich-result eligibility in search (quick task 260728-kcg).
 *
 * `dateModified` falls back to `datePublished` because Schema.org treats a
 * dateModified earlier than datePublished as invalid, and Notion's
 * last_edited_time is occasionally unset on imported pages.
 */
export function buildBlogPostingSchema(post: BlogPostingInput) {
  const url = canonical(`/blog/${post.slug}`)
  const datePublished = post.date || post.lastEdited || undefined

  const node: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    author: {
      '@type': 'Person',
      name: 'Monty Singer',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Person',
      name: 'Monty Singer',
      url: SITE_URL,
    },
  }

  if (datePublished) {
    node.datePublished = datePublished
    node.dateModified = post.lastEdited || datePublished
  }
  if (post.coverPageId) {
    node.image = `${SITE_URL}/api/notion-cover?pageId=${post.coverPageId}`
  }
  if (post.wordCount && post.wordCount > 0) {
    node.wordCount = post.wordCount
  }

  return node
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

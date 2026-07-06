import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getPublishedPosts, getPostBySlug, getBlocks } from '@/lib/notion'
import { NotionRenderer } from '@/components/notion/notion-renderer'
import { calculateReadingTime } from '@/utils/reading-time'
import { NewsletterCta } from '@/components/blog/newsletter-cta'
import { Breadcrumbs } from '@/components/seo/breadcrumbs'
import { RelatedEssays } from '@/components/blog/related-essays'
import { PageHero } from '@/components/v3/page-hero'
import { RuleStrong } from '@/components/v3/rule-strong'
import { buildBlogPostMetadata } from '@/lib/seo/blog-metadata'
import { formatMonthYear } from '@/lib/dates'
import type { Metadata } from 'next'
import type { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints'

export const revalidate = 1800; // 30 minutes

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_DATABASE_ID) {
    return []
  }
  try {
    const posts = await getPublishedPosts()
    return posts.map((post) => ({ slug: post.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return { title: 'Post Not Found' }
  return buildBlogPostMetadata(post)
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) notFound()

  const blocks = await getBlocks(post.id)
  const readingTime = calculateReadingTime(blocks)

  return (
    <>
      {/* Semantic breadcrumb nav + JSON-LD (sr-only); Writing points to /writing per D-14 */}
      <Breadcrumbs
        items={[
          { name: 'Home', href: '/' },
          { name: 'Writing', href: '/writing' },
          { name: post.title },
        ]}
      />

      {/* Full-bleed cover image (D-02) — only when post.cover exists */}
      {post.cover && (
        <div className="relative w-full h-[400px] md:h-[600px]">
          <Image
            src={`/api/notion-cover?pageId=${post.id}`}
            alt={`${post.title} cover`}
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            className="object-cover"
          />
        </div>
      )}

      {/* PageHero: breadcrumb line + title (D-14) */}
      <div className="px-6 md:px-40">
        <PageHero
          title={post.title}
          crumb="Home / Writing"
        />

        {/* Meta row: reading time · publish date · optional first tag */}
        <div className="flex flex-wrap items-center gap-[18px] font-mono text-xs text-[var(--color-text-muted)] mb-6 -mt-6">
          <span>{readingTime} min read</span>
          {post.date && (
            <>
              <span className="text-[var(--accent)]">.</span>
              <span>{formatMonthYear(post.date)}</span>
            </>
          )}
          {post.tags?.[0] && (
            <>
              <span className="text-[var(--accent)]">.</span>
              <span>{post.tags[0]}</span>
            </>
          )}
        </div>
      </div>

      <RuleStrong />

      {/* Prose section (IN-01/IN-02) — NotionRenderer is UNCHANGED */}
      <article className="mx-auto max-w-[68ch] px-6 pb-16 pt-8 md:px-0">
        <div className="prose max-w-none">
          <NotionRenderer blocks={blocks as (BlockObjectResponse & { children?: BlockObjectResponse[] })[]} />
        </div>

        <NewsletterCta />
        <RelatedEssays currentSlug={slug} />
      </article>
    </>
  )
}

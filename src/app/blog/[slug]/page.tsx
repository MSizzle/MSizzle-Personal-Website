import { notFound } from 'next/navigation'
import { getPublishedPosts, getPostBySlug, getBlocks } from '@/lib/notion'
import { NotionRenderer } from '@/components/notion/notion-renderer'
import { calculateReadingTime } from '@/utils/reading-time'
import { NewsletterCta } from '@/components/blog/newsletter-cta'
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

  return {
    title: `${post.title} — Monty Singer`,
    description: post.description || undefined,
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) notFound()

  const blocks = await getBlocks(post.id)
  const readingTime = calculateReadingTime(blocks)

  return (
    <article className="mx-auto max-w-[66ch] px-6 pb-16 pt-24 md:px-0">
      <header className="mb-12">
        <h1 className="text-2xl font-normal tracking-tight sm:text-3xl">
          {post.emoji && <span className="mr-3">{post.emoji}</span>}{post.title}
        </h1>
        <div className="mt-4 flex items-center gap-4 text-sm opacity-50">
          {post.date && (
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          )}
          {post.date && <span>&middot;</span>}
          <span>{readingTime} min read</span>
          {post.tags.length > 0 && (
            <>
              <span>&middot;</span>
              <div className="flex gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
        {post.description && (
          <p className="mt-4 text-lg opacity-80">
            {post.description}
          </p>
        )}
      </header>

      <div className="prose max-w-none">
        <NotionRenderer blocks={blocks as (BlockObjectResponse & { children?: BlockObjectResponse[] })[]} />
      </div>

      <NewsletterCta />
    </article>
  )
}

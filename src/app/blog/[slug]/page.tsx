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
    <article className="mx-auto max-w-3xl px-6 pb-24 pt-32">
      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {post.title}
        </h1>
        <div className="mt-4 flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
          {post.date && (
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          )}
          {post.date && (
            <span className="text-neutral-300 dark:text-neutral-600">&middot;</span>
          )}
          <span>{readingTime} min read</span>
          {post.tags.length > 0 && (
            <>
              <span className="text-neutral-300 dark:text-neutral-600">&middot;</span>
              <div className="flex gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
        {post.description && (
          <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
            {post.description}
          </p>
        )}
      </header>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <NotionRenderer blocks={blocks as (BlockObjectResponse & { children?: BlockObjectResponse[] })[]} />
      </div>

      <NewsletterCta />
    </article>
  )
}

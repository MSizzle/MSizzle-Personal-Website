import { Suspense } from 'react'
import { getPublishedPosts } from '@/lib/notion'
import { TagFilter } from '@/components/blog/tag-filter'
import { estimateReadingTime } from '@/utils/reading-time'
import { ScrollReveal } from '@/components/animations/scroll-reveal'

export const revalidate = 1800; // 30 minutes

export const metadata = {
  title: 'Blog — Monty Singer',
  description: 'Ideas, observations, and lessons learned.',
}

export default async function BlogPage() {
  let posts: Awaited<ReturnType<typeof getPublishedPosts>> = []
  if (process.env.NOTION_TOKEN && process.env.NOTION_DATABASE_ID) {
    try {
      posts = await getPublishedPosts()
    } catch {
      // Notion API unavailable — show empty state
    }
  }

  const readingTimes: Record<string, number> = {}
  for (const post of posts) {
    readingTimes[post.slug] = estimateReadingTime(post.description)
  }

  return (
    <div className="mx-auto max-w-2xl px-6 pb-16 pt-24">
      <ScrollReveal delay={0}>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Writing
        </h1>
        <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
          Ideas, observations, and lessons learned.
        </p>
      </ScrollReveal>

      {posts.length === 0 ? (
        <ScrollReveal delay={0.15}>
          <p className="mt-12 text-neutral-500 dark:text-neutral-400">
            No posts yet. Check back soon.
          </p>
        </ScrollReveal>
      ) : (
        <>
          <ScrollReveal delay={0.15}>
            <Suspense fallback={<div className="mt-12">Loading...</div>}>
              <TagFilter posts={posts} readingTimes={readingTimes} />
            </Suspense>
          </ScrollReveal>
        </>
      )}
    </div>
  )
}

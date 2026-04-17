import { Suspense } from 'react'
import { getPublishedPosts, getPostExcerpt } from '@/lib/notion'
import { TagFilter } from '@/components/blog/tag-filter'
import { estimateReadingTime } from '@/utils/reading-time'
import { ScrollReveal } from '@/components/animations/scroll-reveal'
import { Breadcrumbs } from '@/components/seo/breadcrumbs'

export const revalidate = 1800; // 30 minutes

export const metadata = {
  title: 'Writings | Monty Singer',
  description:
    'Essays by Monty Singer on philosophy, technology, AI, entrepreneurship, and life. New writing most weeks.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Writings | Monty Singer',
    description:
      'Essays by Monty Singer on philosophy, technology, AI, entrepreneurship, and life. New writing most weeks.',
    url: '/blog',
    type: 'website',
  },
}

export default async function BlogPage() {
  let posts: Awaited<ReturnType<typeof getPublishedPosts>> = []
  if (process.env.NOTION_TOKEN && process.env.NOTION_DATABASE_ID) {
    try {
      posts = await getPublishedPosts()
    } catch {
      // Notion API unavailable, show empty state
    }
  }

  const readingTimes: Record<string, number> = {}
  const excerpts: Record<string, string> = {}
  for (const post of posts) {
    readingTimes[post.slug] = estimateReadingTime(post.description)
  }
  await Promise.all(
    posts.map(async (post) => {
      try {
        excerpts[post.slug] = await getPostExcerpt(post.id)
      } catch {
        excerpts[post.slug] = post.description
      }
    })
  )

  return (
    <>
      <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Writings' }]} />
      <div className="mx-auto max-w-3xl px-6 pb-16 pt-24 md:px-0">
        <ScrollReveal delay={0}>
          <h1 className="text-sm font-normal uppercase tracking-widest">
            Writings
          </h1>
        </ScrollReveal>

        {posts.length === 0 ? (
          <ScrollReveal delay={0.15}>
            <p className="mt-8 opacity-75">
              No posts yet. Check back soon.
            </p>
          </ScrollReveal>
        ) : (
          <>
            <ScrollReveal delay={0.15}>
              <Suspense fallback={<div className="mt-8">Loading...</div>}>
                <TagFilter posts={posts} readingTimes={readingTimes} excerpts={excerpts} />
              </Suspense>
            </ScrollReveal>
          </>
        )}
      </div>
    </>
  )
}

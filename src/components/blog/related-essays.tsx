import Link from 'next/link'
import { getPostBySlug } from '@/lib/notion'
import { RELATED_ESSAYS } from '@/data/related-essays'

export async function RelatedEssays({ currentSlug }: { currentSlug: string }) {
  const relatedSlugs = RELATED_ESSAYS[currentSlug] ?? []
  if (relatedSlugs.length === 0) return null

  const resolved = await Promise.all(
    relatedSlugs.map(async (slug) => {
      try {
        return await getPostBySlug(slug)
      } catch {
        return null
      }
    })
  )
  const posts = resolved.filter((p): p is NonNullable<typeof p> => p != null)

  if (posts.length === 0) return null

  return (
    <section className="mt-16 border-t border-[var(--border)] pt-8">
      <h2 className="text-sm font-normal uppercase tracking-widest">Related Essays</h2>
      <ul className="mt-4 space-y-4">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="group block transition-opacity hover:opacity-70"
            >
              <div className="text-base">
                {post.emoji && <span className="mr-2">{post.emoji}</span>}
                <span className="underline">{post.title}</span>
              </div>
              {post.description && (
                <p className="mt-1 text-sm opacity-60">{post.description}</p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

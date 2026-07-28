import Link from 'next/link'
import { getPublishedPosts, type BlogPost } from '@/lib/notion'
import { RELATED_ESSAYS } from '@/data/related-essays'

const TARGET_COUNT = 3

/**
 * Pick related posts for `currentSlug`.
 *
 * The hand-curated RELATED_ESSAYS map carries editorial intent and stays the
 * preferred source, but it only covers slugs someone remembered to add. Posts
 * missing from it rendered no related section at all -- which is how
 * /blog/vibe-check ended up serving zero onward links (quick task 260728-kcg).
 *
 * So the map is now a seed rather than the whole answer: whatever it yields is
 * topped up to TARGET_COUNT from the rest of the archive, preferring posts that
 * share a tag with the current one and falling back to the most recent. New
 * posts get sensible links the day they publish, with no map edit required.
 */
export function selectRelatedPosts(
  currentSlug: string,
  allPosts: BlogPost[],
): BlogPost[] {
  const bySlug = new Map(allPosts.map((p) => [p.slug, p]))
  const current = bySlug.get(currentSlug)

  const picked: BlogPost[] = []
  const taken = new Set<string>([currentSlug])

  const take = (post: BlogPost | undefined) => {
    if (!post || taken.has(post.slug) || picked.length >= TARGET_COUNT) return
    taken.add(post.slug)
    picked.push(post)
  }

  // 1. Curated map first, in its authored order.
  for (const slug of RELATED_ESSAYS[currentSlug] ?? []) take(bySlug.get(slug))

  // 2. Top up with tag matches, most tags in common first, then most recent.
  if (picked.length < TARGET_COUNT && current?.tags?.length) {
    const currentTags = new Set(current.tags)
    const scored = allPosts
      .filter((p) => !taken.has(p.slug))
      .map((p) => ({
        post: p,
        shared: p.tags.filter((t) => currentTags.has(t)).length,
      }))
      .filter((c) => c.shared > 0)
      .sort(
        (a, b) =>
          b.shared - a.shared ||
          (b.post.date || '').localeCompare(a.post.date || ''),
      )
    for (const c of scored) take(c.post)
  }

  // 3. Still short: most recent remaining posts.
  if (picked.length < TARGET_COUNT) {
    const recent = allPosts
      .filter((p) => !taken.has(p.slug))
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
    for (const p of recent) take(p)
  }

  return picked
}

export async function RelatedEssays({ currentSlug }: { currentSlug: string }) {
  // One query for the whole archive instead of one per related slug: it feeds
  // both the lookup and the top-up pool, and ISR caps how often it runs.
  let allPosts: BlogPost[] = []
  try {
    allPosts = await getPublishedPosts()
  } catch {
    return null
  }

  const posts = selectRelatedPosts(currentSlug, allPosts)
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

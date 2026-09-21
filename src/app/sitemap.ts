import type { MetadataRoute } from 'next'
import { getPublishedPosts } from '@/lib/notion'
import { getPublishedProjects } from '@/lib/notion-projects'
import { SITE_URL } from '@/lib/seo/site'

/**
 * Last real content change per static route, hand-maintained. Dates, not
 * `new Date()`: an honest stamp is the whole point of lastModified.
 */
const STATIC_LAST_MODIFIED: Record<string, string> = {
  '/': '2026-09-16',
  '/building': '2026-09-16',
  '/writing': '2026-09-16',
  '/about': '2026-09-21',
  '/contact': '2026-09-20',
  '/advice': '2026-09-21',
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let posts: { slug: string; lastEdited: string }[] = []
  let projects: { slug: string; lastEdited: string }[] = []

  try {
    posts = await getPublishedPosts()
  } catch {}

  try {
    projects = await getPublishedProjects()
  } catch {}

  // Static routes: /, /building, /writing, /about, /contact, /advice = 6
  // (/uses removed — "Things I Love" now lives as the homepage #loves section.)
  // (/contact added in quick task 260708-lqc — dedicated contact route.)
  // (/advice added in quick task 260920-ofb.)
  // (/about restored in 260921-ed0 — it used to 301 to the homepage.)
  // (/prometheus removed in 260728-kcg — the route now 301s to prometheus.today,
  //  and redirects must never be listed in a sitemap.)
  //
  // lastModified is a hand-kept date per route, not `new Date()`. Stamping
  // every static route with "now" on each crawl told search engines the whole
  // site changed constantly, which is both false and a reason to discount the
  // signal entirely (260921-ed0). Bump the date here when you change a page.
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: STATIC_LAST_MODIFIED['/'], changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/building`, lastModified: STATIC_LAST_MODIFIED['/building'], changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/writing`, lastModified: STATIC_LAST_MODIFIED['/writing'], changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/about`, lastModified: STATIC_LAST_MODIFIED['/about'], changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/contact`, lastModified: STATIC_LAST_MODIFIED['/contact'], changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/advice`, lastModified: STATIC_LAST_MODIFIED['/advice'], changeFrequency: 'monthly', priority: 0.6 },
  ]

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.lastEdited),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${SITE_URL}/building/${project.slug}`,
    lastModified: new Date(project.lastEdited),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...postRoutes, ...projectRoutes]
}

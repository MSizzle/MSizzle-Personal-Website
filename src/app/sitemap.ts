import type { MetadataRoute } from 'next'
import { getPublishedPosts } from '@/lib/notion'
import { getPublishedProjects } from '@/lib/notion-projects'
import { SITE_URL } from '@/lib/seo/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let posts: { slug: string; lastEdited: string }[] = []
  let projects: { slug: string; lastEdited: string }[] = []

  try {
    posts = await getPublishedPosts()
  } catch {}

  try {
    projects = await getPublishedProjects()
  } catch {}

  // Static routes: /, /building, /writing, /contact = 4
  // (/uses removed — "Things I Love" now lives as the homepage #loves section.)
  // (/contact added in quick task 260708-lqc — dedicated contact route.)
  // (/prometheus removed in 260728-kcg — the route now 301s to prometheus.today,
  //  and redirects must never be listed in a sitemap.)
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/building`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/writing`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
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

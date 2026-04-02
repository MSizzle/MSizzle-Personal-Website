import type { MetadataRoute } from 'next'
import { getPublishedPosts } from '@/lib/notion'
import { getPublishedProjects } from '@/lib/notion-projects'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://msizzle.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let posts: { slug: string; lastEdited: string }[] = []
  let projects: { slug: string; lastEdited: string }[] = []

  try {
    posts = await getPublishedPosts()
  } catch {
    // Notion unavailable — sitemap still works with static routes
  }

  try {
    projects = await getPublishedProjects()
  } catch {
    // Notion unavailable — sitemap still works with static routes
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/projects`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/links`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.lastEdited),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${SITE_URL}/projects/${project.slug}`,
    lastModified: new Date(project.lastEdited),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...postRoutes, ...projectRoutes]
}

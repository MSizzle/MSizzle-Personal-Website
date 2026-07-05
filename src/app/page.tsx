import { JsonLd } from "@/components/seo/json-ld";
import { buildPersonSchema } from "@/lib/seo/schemas";
import { ExplorativeHomepage } from "@/components/home/explorative-homepage";
import { getFeaturedProjects, type Project } from "@/lib/notion-projects";
import { getPublishedPosts, type BlogPost } from "@/lib/notion";

/**
 * Homepage — ISR Server Component for the personal-brand narrative arc.
 *
 * Narrative arc: who am I -> what I am building -> how to engage.
 *
 * Fetches the Featured Notion projects (Work grid covers) and the latest
 * published essays (Monty Monthly carousel covers), then hands them to the
 * ExplorativeHomepage orchestrator. Fetches are defensive: any Notion failure
 * yields an empty list and the affected section falls back to placeholders /
 * hardcoded copy, so the home path never crashes. revalidate=1800 matches
 * /portfolio and /writing so covers and lists stay fresh without a redeploy.
 */
export const revalidate = 1800;

export default async function Home() {
  let projects: Project[] = [];
  let posts: BlogPost[] = [];
  try {
    projects = await getFeaturedProjects();
  } catch {}
  try {
    posts = await getPublishedPosts();
  } catch {}

  return (
    <>
      <JsonLd data={buildPersonSchema()} />
      <ExplorativeHomepage projects={projects} posts={posts} />
    </>
  );
}

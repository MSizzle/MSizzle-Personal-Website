import { JsonLd } from "@/components/seo/json-ld";
import { buildPersonSchema } from "@/lib/seo/schemas";
import { ExplorativeHomepage } from "@/components/home/explorative-homepage";
import { getFeaturedProjects, type Project } from "@/lib/notion-projects";
import { getLovesData, type LoveItem } from "@/lib/notion-loves";
import { fetchMontyMonthlyIssues, type MontyMonthlyIssue } from "@/lib/rss/substack";
import { getPublishedPosts, type BlogPost } from "@/lib/notion";

/**
 * Homepage — ISR Server Component for the personal-brand narrative arc.
 *
 * Narrative arc: who am I -> what I am building -> how to engage.
 *
 * Fetches the Featured Notion projects (Work grid covers) and the latest Monty
 * Monthly issues from the Substack RSS feed (carousel cards), then hands them to
 * the ExplorativeHomepage orchestrator. Fetches are defensive: any Notion/RSS
 * failure yields an empty list and the affected section falls back to
 * placeholders / hardcoded copy, so the home path never crashes. revalidate=1800
 * matches /building and /writing so covers and lists stay fresh without a redeploy.
 */
export const revalidate = 1800;

export default async function Home() {
  let projects: Project[] = [];
  let montyIssues: MontyMonthlyIssue[] = [];
  let loves: LoveItem[] = [];
  let loveCategories: string[] = [];
  let posts: BlogPost[] = [];
  try {
    projects = await getFeaturedProjects();
  } catch {}
  try {
    montyIssues = await fetchMontyMonthlyIssues(4);
  } catch {}
  try {
    const lovesData = await getLovesData();
    loves = lovesData.items;
    loveCategories = lovesData.categoryOrder;
  } catch {}
  try {
    posts = await getPublishedPosts();
  } catch {}

  return (
    <>
      <JsonLd data={buildPersonSchema()} />
      <ExplorativeHomepage
        projects={projects}
        montyIssues={montyIssues}
        loves={loves}
        loveCategories={loveCategories}
        posts={posts}
      />
    </>
  );
}

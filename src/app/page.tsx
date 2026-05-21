import Link from "next/link";
import Image from "next/image";
import { getPublishedPosts } from "@/lib/notion";
import { getFeaturedProjects } from "@/lib/notion-projects";
import { getUpcomingEvents } from "@/lib/notion-events";
import { JsonLd } from "@/components/seo/json-ld";
import { buildPersonSchema } from "@/lib/seo/schemas";

export const revalidate = 1800;

export default async function Home() {
  // Notion getters preserved from v1.0 — consumed by Plans 10-02 (projects),
  // 10-03 (posts + upcomingEvents). Defensive try/catch mirrors the v1.0 pattern
  // so a transient Notion API failure cannot break the homepage render.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let posts: Awaited<ReturnType<typeof getPublishedPosts>> = [];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let projects: Awaited<ReturnType<typeof getFeaturedProjects>> = [];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let upcomingEvents: Awaited<ReturnType<typeof getUpcomingEvents>> = [];

  try {
    posts = await getPublishedPosts();
  } catch {}
  try {
    projects = await getFeaturedProjects();
  } catch {}
  try {
    upcomingEvents = await getUpcomingEvents();
  } catch {}

  return (
    <>
      <JsonLd data={buildPersonSchema()} />

      {/* Editorial header — HOME-V2-01 (D-07 + D-08) */}
      <header className="flex items-baseline justify-between px-6 pt-7 md:px-40 md:pt-9">
        <Link href="/" className="text-[15px] font-bold tracking-tight text-ink">
          Monty Singer
        </Link>
        <nav>
          <ul className="flex list-none items-baseline gap-8 text-nav text-ink">
            <li>
              <Link href="/projects" className="transition-opacity hover:opacity-60">
                Building
              </Link>
            </li>
            <li>
              <Link href="/blog" className="transition-opacity hover:opacity-60">
                Writing
              </Link>
            </li>
            <li>
              <Link href="/events" className="transition-opacity hover:opacity-60">
                Events
              </Link>
            </li>
            <li>
              <Link href="/about" className="transition-opacity hover:opacity-60">
                About
              </Link>
            </li>
            <li>
              <Link href="/links" className="transition-opacity hover:opacity-60">
                Links
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* Hero — HOME-V2-02 manifesto + HOME-V2-03 meta row + HOME-V2-04 epigraph */}
      <section className="px-6 pt-16 md:px-40 md:pt-24">
        <h1 className="text-display uppercase text-ink">
          <span className="block whitespace-nowrap">BRING FIRE</span>
          <span className="block whitespace-nowrap">TO HUMANITY.</span>
        </h1>
        {/* Plan 10-07 wraps this h1 with <ManifestoReveal lines={...} /> */}

        {/* Meta row — D-06 */}
        <div className="mt-14 flex items-center gap-3">
          <span aria-hidden="true" className="inline-block h-px w-8 bg-ink" />
          <span className="text-meta uppercase text-muted">
            EST. 2026 · WASHINGTON, D.C.
          </span>
        </div>

        {/* Epigraph — D-09 + D-10 */}
        <figure className="mt-20">
          <Image
            src="/MSizzle-website-photos/000092530012.jpeg"
            alt="A year in motion, on film"
            width={1120}
            height={540}
            priority
            sizes="(max-width: 768px) 100vw, 1120px"
            className="aspect-[1120/540] w-full object-cover"
          />
          <figcaption className="mt-4 flex justify-between text-meta uppercase text-muted">
            <span>Plate I — A year in motion · 2025–26</span>
            <span>Photographed on film</span>
          </figcaption>
        </figure>
      </section>

      {/* PLAN-10-02 INTRO + BUILDING */}
      {/* PLAN-10-03 WRITING + EVENTS */}
      {/* PLAN-10-04 PHOTOGRAPHS */}
      {/* PLAN-10-05 PERSONAL + FOOTER */}
    </>
  );
}

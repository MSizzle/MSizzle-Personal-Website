import fs from "fs";
import path from "path";
import Link from "next/link";
import { getPublishedPosts } from "@/lib/notion";
import { getFeaturedProjects } from "@/lib/notion-projects";
import { getUpcomingEvents, getPastEvents } from "@/lib/notion-events";
import { PhotoCarousel } from "@/components/home/photo-carousel";
import { RotatingTagline } from "@/components/home/rotating-tagline";
import { JsonLd } from "@/components/seo/json-ld";
import { buildPersonSchema } from "@/lib/seo/schemas";

function getCarouselPhotos(): string[] {
  try {
    const dir = path.join(process.cwd(), "public", "MSizzle-website-photos");
    return fs
      .readdirSync(dir)
      .filter((f) => /\.(jpg|jpeg|png|webp|gif)$/i.test(f))
      .sort()
      .map((f) => `/MSizzle-website-photos/${f}`);
  } catch {
    return [];
  }
}

export const revalidate = 1800;

export default async function Home() {
  let posts: Awaited<ReturnType<typeof getPublishedPosts>> = [];
  let projects: Awaited<ReturnType<typeof getFeaturedProjects>> = [];
  let upcomingEvents: Awaited<ReturnType<typeof getUpcomingEvents>> = [];
  let pastEvents: Awaited<ReturnType<typeof getPastEvents>> = [];

  try {
    posts = await getPublishedPosts();
  } catch {}
  try {
    projects = await getFeaturedProjects();
  } catch {}
  try {
    upcomingEvents = await getUpcomingEvents();
  } catch {}
  try {
    pastEvents = await getPastEvents();
  } catch {}

  const carouselPhotos = getCarouselPhotos();

  return (
    <>
      <JsonLd data={buildPersonSchema()} />

      {/* Hero - editorial intro */}
      <section className="px-6 pt-32 pb-20 md:px-24">
        <div className="mx-auto max-w-[66ch]">
          <h1 className="text-4xl font-normal uppercase tracking-tight sm:text-5xl">
            Monty Singer
          </h1>
          <p className="mt-6 text-lg leading-relaxed opacity-80">
            I&rsquo;m Monty Singer, founder of Prometheus, an AI integrations and education company.
            I build software, write essays, and tinker with whatever is interesting.
          </p>
          <div className="mt-4">
            <RotatingTagline />
          </div>
          <div className="mt-8 flex items-center gap-6">
            <a
              href="https://prometheus.today"
              target="_blank"
              rel="noopener noreferrer"
              className="underline transition-opacity hover:opacity-60"
            >
              Prometheus
            </a>
            <Link
              href="/about"
              className="underline transition-opacity hover:opacity-60"
            >
              More About Me
            </Link>
            <a
              href="#contact"
              className="underline transition-opacity hover:opacity-60"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>

      {/* Photo carousel */}
      {carouselPhotos.length > 0 && (
        <section className="px-6 pb-20 md:px-24">
          <div className="mx-auto max-w-[66ch]">
            <PhotoCarousel photos={carouselPhotos} />
          </div>
        </section>
      )}

      {/* Writings */}
      <section className="px-6 pb-20 md:px-24">
        <div className="mx-auto max-w-[66ch]">
          <Link
            href="/blog"
            className="text-base font-normal uppercase tracking-widest transition-opacity hover:opacity-60"
          >
            Writings &#8600;
          </Link>
          <ul className="mt-4 space-y-2">
            {posts.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex items-baseline transition-opacity hover:opacity-60"
                >
                  {post.emoji && (
                    <span className="mr-2 shrink-0 no-underline">{post.emoji}</span>
                  )}
                  <span className="underline">{post.title}</span>
                </Link>
              </li>
            ))}
            {posts.length === 0 && (
              <li className="opacity-50">More posts coming soon.</li>
            )}
          </ul>
        </div>
      </section>

      {/* Works */}
      <section className="px-6 pb-20 md:px-24">
        <div className="mx-auto max-w-[66ch]">
          <Link
            href="/projects"
            className="text-base font-normal uppercase tracking-widest transition-opacity hover:opacity-60"
          >
            Works &#8600;
          </Link>
          <ul className="mt-4 space-y-2">
            {projects.map((project) => (
              <li key={project.id}>
                <Link
                  href={`/projects/${project.slug}`}
                  className="group flex items-baseline transition-opacity hover:opacity-60"
                >
                  {project.emoji && (
                    <span className="mr-2 shrink-0 no-underline">{project.emoji}</span>
                  )}
                  <span className="underline">{project.title}</span>
                  {project.description && (
                    <span className="ml-2 text-base opacity-50 no-underline">
                      &bull; {project.description}
                    </span>
                  )}
                </Link>
              </li>
            ))}
            {projects.length === 0 && (
              <li className="opacity-50">Projects coming soon.</li>
            )}
          </ul>
        </div>
      </section>

      {/* Events */}
      <section className="px-6 pb-20 md:px-24">
        <div className="mx-auto max-w-[66ch]">
          <Link
            href="/events"
            className="text-base font-normal uppercase tracking-widest transition-opacity hover:opacity-60"
          >
            Events &#8600;
          </Link>
          {pastEvents.length > 0 && (
            <>
              <h3 className="mt-4 text-xs font-normal uppercase tracking-widest opacity-50">
                Previous
              </h3>
              <ul className="mt-2 space-y-2">
                {pastEvents.slice(0, 5).map((event) => (
                  <li key={event.id}>
                    {event.link ? (
                      <a
                        href={event.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-baseline transition-opacity hover:opacity-60"
                      >
                        {event.emoji && (
                          <span className="mr-2 shrink-0 no-underline">{event.emoji}</span>
                        )}
                        <span className="underline">{event.name}</span>
                        <span className="ml-2 text-base opacity-50 no-underline">
                          &bull;{" "}
                          {event.date
                            ? new Date(event.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })
                            : "TBD"}
                          {event.location && `, ${event.location}`}
                        </span>
                      </a>
                    ) : (
                      <span className="flex items-baseline">
                        {event.emoji && (
                          <span className="mr-2 shrink-0">{event.emoji}</span>
                        )}
                        <span>{event.name}</span>
                        <span className="ml-2 text-base opacity-50">
                          &bull;{" "}
                          {event.date
                            ? new Date(event.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })
                            : "TBD"}
                          {event.location && `, ${event.location}`}
                        </span>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </>
          )}

          {upcomingEvents.length > 0 && (
            <>
              <h3 className="mt-4 text-xs font-normal uppercase tracking-widest opacity-50">
                Upcoming
              </h3>
              <ul className="mt-2 space-y-2">
                {upcomingEvents.slice(0, 5).map((event) => (
                  <li key={event.id}>
                    {event.link ? (
                      <a
                        href={event.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-baseline transition-opacity hover:opacity-60"
                      >
                        {event.emoji && (
                          <span className="mr-2 shrink-0 no-underline">{event.emoji}</span>
                        )}
                        <span className="underline">{event.name}</span>
                        <span className="ml-2 text-base opacity-50 no-underline">
                          &bull;{" "}
                          {event.date
                            ? new Date(event.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })
                            : "TBD"}
                          {event.location && `, ${event.location}`}
                        </span>
                      </a>
                    ) : (
                      <span className="flex items-baseline">
                        {event.emoji && (
                          <span className="mr-2 shrink-0">{event.emoji}</span>
                        )}
                        <span>{event.name}</span>
                        <span className="ml-2 text-base opacity-50">
                          &bull;{" "}
                          {event.date
                            ? new Date(event.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })
                            : "TBD"}
                          {event.location && `, ${event.location}`}
                        </span>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </>
          )}

          {pastEvents.length === 0 && upcomingEvents.length === 0 && (
            <p className="mt-4 opacity-50">Events coming soon.</p>
          )}
        </div>
      </section>
    </>
  );
}

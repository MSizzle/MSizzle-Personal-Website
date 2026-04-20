import fs from "fs";
import path from "path";
import Link from "next/link";
import { getPublishedPosts } from "@/lib/notion";
import { getFeaturedProjects } from "@/lib/notion-projects";
import { getUpcomingEvents, getPastEvents } from "@/lib/notion-events";
import { PhotoCarousel } from "@/components/home/photo-carousel";
import { WritingsCarousel } from "@/components/home/writings-carousel";
import { WorksCarousel } from "@/components/home/works-carousel";
import { RotatingTagline } from "@/components/home/rotating-tagline";
import {
  FeaturedUpcoming,
  UpcomingMini,
  PastEventCard,
} from "@/components/events/event-cards";
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

      {/* Photo carousel - full bleed, above hero */}
      {carouselPhotos.length > 0 && (
        <section className="pt-8 pb-6 overflow-hidden">
          <PhotoCarousel photos={carouselPhotos} />
        </section>
      )}

      {/* Hero - editorial intro */}
      <section className="px-6 pt-6 pb-20 md:px-24">
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

      {/* Writings */}
      <section className="px-6 pb-20 md:px-24">
        <div className="mx-auto max-w-[66ch]">
          <Link
            href="/blog"
            className="text-base font-normal uppercase tracking-widest transition-opacity hover:opacity-60"
          >
            Writings &#8600;
          </Link>
          {posts.length > 0 ? (
            <div className="mt-6">
              <WritingsCarousel posts={posts} />
            </div>
          ) : (
            <p className="mt-4 opacity-75">More posts coming soon.</p>
          )}
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
          {projects.length > 0 ? (
            <div className="mt-6">
              <WorksCarousel projects={projects} referenceCount={posts.length} />
            </div>
          ) : (
            <p className="mt-4 opacity-75">Projects coming soon.</p>
          )}
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

          {(() => {
            const [featured, ...moreUpcoming] = upcomingEvents;
            const recentPast = pastEvents.slice(0, 6);
            const hasAny = upcomingEvents.length > 0 || recentPast.length > 0;

            if (!hasAny) {
              return <p className="mt-4 opacity-75">Events coming soon.</p>;
            }

            return (
              <>
                {featured && <FeaturedUpcoming event={featured} />}

                {moreUpcoming.length > 0 && (
                  <div className="mt-10">
                    <h2 className="text-xs font-normal uppercase tracking-widest opacity-75">
                      Also Coming Up
                    </h2>
                    <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
                      {moreUpcoming.slice(0, 4).map((event, i) => (
                        <UpcomingMini
                          key={event.id}
                          event={event}
                          delay={0.2 + i * 0.05}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {recentPast.length > 0 && (
                  <div className="mt-10">
                    <h2 className="text-xs font-normal uppercase tracking-widest opacity-75">
                      Past
                    </h2>
                    <div className="mt-4 columns-1 gap-5 sm:columns-2">
                      {recentPast.map((event, i) => (
                        <PastEventCard
                          key={event.id}
                          event={event}
                          delay={0.25 + i * 0.03}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      </section>

    </>
  );
}

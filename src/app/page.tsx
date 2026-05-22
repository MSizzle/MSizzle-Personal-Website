import Image from "next/image";
import { getPublishedPosts } from "@/lib/notion";
import { getFeaturedProjects } from "@/lib/notion-projects";
import { getUpcomingEvents } from "@/lib/notion-events";
import { JsonLd } from "@/components/seo/json-ld";
import { buildPersonSchema } from "@/lib/seo/schemas";
import { IntroLink } from "@/components/editorial/intro-link";
import { RuleStrong } from "@/components/editorial/rule-strong";
import { Rule } from "@/components/editorial/rule";
import { SectionLabel } from "@/components/editorial/section-label";
import { AllLink } from "@/components/editorial/all-link";
import { ListRow } from "@/components/editorial/list-row";
import { ManifestoReveal } from "@/components/home-v2/manifesto-reveal";
import { CyclingPhoto } from "@/components/home-v2/cycling-photo";
import { formatMonthYear, formatMonthDay } from "@/lib/dates";

// Per-plate className contains literal `md:col-span-N md:row-span-M` tokens so the
// Tailwind v4 scanner picks them up at build time (no dynamic-class interpolation).
// Mobile default: `aspect-square` in the 2-col grid; at md: revert to grid-rows-driven asymmetric layout.
const HOME_PHOTOS = [
  { src: "/MSizzle-website-photos/000092530012.jpeg",      no: "01", className: "relative aspect-square md:aspect-auto md:col-span-7 md:row-span-3" },
  { src: "/MSizzle-website-photos/20230928%20MSB_0114.jpg", no: "02", className: "relative aspect-square md:aspect-auto md:col-span-5 md:row-span-2" },
  { src: "/MSizzle-website-photos/IMG_0028.jpeg",          no: "03", className: "relative aspect-square md:aspect-auto md:col-span-3 md:row-span-1" },
  { src: "/MSizzle-website-photos/IMG_1075.JPG",           no: "04", className: "relative aspect-square md:aspect-auto md:col-span-2 md:row-span-1" },
  { src: "/MSizzle-website-photos/IMG_2129.jpeg",          no: "05", className: "relative aspect-square md:aspect-auto md:col-span-5 md:row-span-2" },
  { src: "/MSizzle-website-photos/Patricof09.jpg",         no: "06", className: "relative aspect-square md:aspect-auto md:col-span-7 md:row-span-2" },
] as const;

const PERSONAL_CARDS = [
  { title: "Photo Archive",     description: "A film-led survey of the year.", href: "/photos" },
  { title: "Links & Elsewhere", description: "Where I show up online.",        href: "/links"  },
  { title: "About",             description: "The longer version.",            href: "/about"  },
] as const;

export const revalidate = 1800;

export default async function Home() {
  // Notion getters preserved from v1.0 — consumed by Plans 10-02 (projects),
  // 10-03 (posts + upcomingEvents). Defensive try/catch mirrors the v1.0 pattern
  // so a transient Notion API failure cannot break the homepage render.
  let posts: Awaited<ReturnType<typeof getPublishedPosts>> = [];
  let projects: Awaited<ReturnType<typeof getFeaturedProjects>> = [];
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

      {/* Hero — HOME-V2-02 manifesto + HOME-V2-03 meta row + HOME-V2-04 epigraph */}
      <section className="px-6 pt-16 md:px-40 md:pt-24">
        {/* Manifesto — MOTION-07: <ManifestoReveal> owns desktop (2 lines) + mobile (3 lines) via matchMedia, with per-letter stagger gated by sessionStorage + useReducedMotion fallback */}
        <ManifestoReveal />

        {/* Meta row — D-06 */}
        <div className="mt-14 flex items-center gap-3">
          <span aria-hidden="true" className="inline-block h-px w-8 bg-ink" />
          <span className="text-meta uppercase text-muted">
            EST. 2026 · WASHINGTON, D.C.
          </span>
        </div>

        {/* Epigraph — D-09 + D-10. Cycling hero (desktop: click + 10s timer; mobile: static). */}
        <figure className="mt-20">
          <CyclingPhoto
            photos={[...HOME_PHOTOS]}
            className="relative aspect-[1120/540] w-full"
            alt="A year in motion, on film"
          />
          <figcaption className="mt-4 text-meta uppercase text-muted">
            A year in motion · 2025–26
          </figcaption>
        </figure>
      </section>

      {/* Letter-style intro — HOME-V2-05 / D-11 + D-12 */}
      <section className="px-6 pt-20 md:px-40 md:pt-24">
        <p className="max-w-[45rem] text-body-lead text-ink">
          I&rsquo;m Monty. I build, write, learn, and lift. I run{" "}
          <IntroLink href="https://prometheus.today" external>Prometheus</IntroLink>, a startup that AI-enables enterprise businesses. We automate processes, build agentic systems, and increase operating leverage. (Check out our{" "}
          <IntroLink href="https://prometheus.today/case-studies.html" external>case studies</IntroLink>.) Once a month I publish{" "}
          <IntroLink href="/newsletter">Monty Monthly</IntroLink>. If you like science, technology, agriculture, fitness, finance, culture, and beekeeping, we&rsquo;ll get along.
        </p>
      </section>

      {/* BUILDING — HOME-V2-06 / D-13–D-16 */}
      <RuleStrong />
      <section className="px-6 pt-[120px] pb-[120px] md:px-40">
        <SectionLabel numeral="01 — Studio">Building</SectionLabel>

        <div className="mt-[72px]">
          {/* Row 1 — Prometheus */}
          <div className="grid grid-cols-1 gap-6 py-9 md:grid-cols-[180px_1fr_1fr] md:gap-12">
            <div className="text-meta uppercase text-muted">Active · AI Studio</div>
            <div className="text-feature text-ink">Prometheus</div>
            <div className="text-body text-ink">
              <p className="text-ink">
                Recent work: orthodontic + hospitality clients running custom AI pipelines designed to outlive the next platform shift.
              </p>
              <div className="mt-4">
                <AllLink href="https://prometheus.today">prometheus.today →</AllLink>
              </div>
            </div>
          </div>

          <Rule />

          {/* Row 2 — Selected Works */}
          <div className="grid grid-cols-1 gap-6 py-9 md:grid-cols-[180px_1fr_1fr] md:gap-12">
            <div className="text-meta uppercase text-muted">
              Archive · {projects.length} projects
            </div>
            <div className="text-feature text-ink">Selected Works</div>
            <div className="text-body text-ink">
              {projects.length === 0 ? (
                <p className="text-muted">Recent work coming soon.</p>
              ) : (
                <p className="text-ink">
                  {projects.slice(0, 8).map((p) => p.title).join(", ")}
                  {projects.length > 8 ? ` +${projects.length - 8} more` : ""}
                </p>
              )}
              <div className="mt-4">
                <AllLink href="/projects">View all works →</AllLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WRITING — HOME-V2-07 / D-13–D-18 */}
      <RuleStrong />
      <section className="px-6 pt-[120px] pb-[120px] md:px-40">
        <SectionLabel numeral="02 — Library">Writing</SectionLabel>

        <div className="mt-[72px]">
          {posts.length === 0 ? (
            <p className="text-caption text-muted">More essays coming soon.</p>
          ) : (
            <div>
              {posts.slice(0, 3).map((post) => (
                <ListRow
                  key={post.id}
                  big
                  href={`/blog/${post.slug}`}
                  title={post.title}
                  extra={post.description}
                  meta={formatMonthYear(post.date)}
                />
              ))}
            </div>
          )}
          <div className="mt-12">
            <AllLink href="/writing">All writing →</AllLink>
          </div>
        </div>
      </section>

      {/* EVENTS — HOME-V2-08 / D-13–D-22 */}
      <RuleStrong />
      <section className="px-6 pt-[120px] pb-[120px] md:px-40">
        <SectionLabel numeral="03 — Calendar">Events</SectionLabel>

        <div className="mt-[72px]">
          {upcomingEvents.length === 0 ? (
            <p className="text-caption text-muted">No upcoming events.</p>
          ) : (
            (() => {
              const featuredEvent = upcomingEvents[0];
              const secondaryEvents = upcomingEvents.slice(1, 3);
              return (
                <>
                  {/* Featured event — inline 3-column grid (D-19) */}
                  <div className="grid grid-cols-1 gap-6 py-9 md:grid-cols-[180px_1fr_auto] md:gap-12">
                    <div>
                      <div className="text-meta uppercase text-ink">
                        NEXT · {formatMonthDay(featuredEvent.date)}
                      </div>
                      <div className="mt-1 text-meta uppercase text-muted">
                        {featuredEvent.location}
                      </div>
                    </div>
                    <div>
                      <div className="text-event-title text-ink">
                        {featuredEvent.name}
                      </div>
                      <div className="mt-4 max-w-[34rem] text-body text-muted">
                        {featuredEvent.description}
                      </div>
                    </div>
                    <div className="md:self-start">
                      <AllLink href={featuredEvent.link || "/events"}>
                        RSVP →
                      </AllLink>
                    </div>
                  </div>

                  {/* Secondary events — 2 ListRow (non-big) per D-21 REVISED */}
                  {secondaryEvents.length > 0 && (
                    <div className="mt-12">
                      {secondaryEvents.map((event) => (
                        <ListRow
                          key={event.id}
                          href={event.link || "/events"}
                          title={event.name}
                          extra={event.description}
                          meta={formatMonthYear(event.date)}
                        />
                      ))}
                    </div>
                  )}
                </>
              );
            })()
          )}
          <div className="mt-12">
            <AllLink href="/events">All events →</AllLink>
          </div>
        </div>
      </section>

      {/* PHOTOGRAPHS — HOME-V2-09 / D-13–D-14 + D-23–D-26 */}
      <RuleStrong />
      <section className="px-6 pt-[120px] pb-[120px] md:px-40">
        <SectionLabel numeral="04 — Archive">Photographs</SectionLabel>

        <div className="mt-[72px]">
          <div className="grid grid-cols-2 gap-2 md:grid-cols-12 md:grid-rows-[180px] md:auto-rows-[180px] md:gap-3">
            {HOME_PHOTOS.map((p) => (
              <div key={p.no} className={p.className}>
                <Image
                  src={p.src}
                  alt=""
                  fill
                  className="object-cover saturate-[0.92]"
                  sizes="(max-width: 768px) 50vw, 50vw"
                />
                <span className="absolute left-3.5 bottom-3 text-[10px] uppercase tracking-[0.2em] font-bold text-paper mix-blend-difference">
                  No. {p.no}
                </span>
              </div>
            ))}
          </div>

          {/* TODO: /photos route lands in Phase 11 (ARCH-03) — current target is 404 until then. */}
          <div className="mt-12">
            <AllLink href="/photos">Photo Archive →</AllLink>
          </div>
        </div>
      </section>

      {/* PERSONAL — HOME-V2-10 / D-13–D-14 + D-27–D-28 */}
      <RuleStrong />
      <section className="px-6 pt-[120px] pb-[120px] md:px-40">
        <SectionLabel numeral="05 — Person">Personal</SectionLabel>

        <div className="mt-[72px] grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-12">
          {PERSONAL_CARDS.map((card) => (
            <div key={card.href} className="border-t border-ink pt-8">
              <h2 className="text-list-title-home font-bold text-ink">{card.title}</h2>
              <p className="mt-3 text-caption text-muted">{card.description}</p>
              <div className="mt-6">
                <AllLink href={card.href}>Enter →</AllLink>
              </div>
            </div>
          ))}
        </div>
      </section>

    </>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import { getUpcomingEvents, getPastEvents } from "@/lib/notion-events";
import type { EventItem } from "@/lib/notion-events";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

export const revalidate = 1800; // 30 minutes

export const metadata: Metadata = {
  title: "Events | Monty Singer",
  description:
    "Upcoming and past events where Monty Singer is speaking, attending, or hosting. Talks on AI, building, and Prometheus.",
  alternates: { canonical: "/events" },
  openGraph: {
    title: "Events | Monty Singer",
    description:
      "Upcoming and past events where Monty Singer is speaking, attending, or hosting. Talks on AI, building, and Prometheus.",
    url: "/events",
    type: "website",
  },
};

function formatLongDate(dateStr: string | null): string {
  if (!dateStr) return "TBD";
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatShortDate(dateStr: string | null): string {
  if (!dateStr) return "TBD";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function FeaturedUpcoming({ event }: { event: EventItem }) {
  return (
    <ScrollReveal delay={0.15}>
      <article className="mt-6">
        {event.image && (
          <div className="mb-6">
            <Image
              src={event.image}
              alt={event.name}
              width={1600}
              height={900}
              sizes="(min-width: 768px) 960px, 100vw"
              className="h-auto w-full"
              priority
              unoptimized
            />
          </div>
        )}

        <h2 className="flex items-center gap-2 text-xs font-normal uppercase tracking-widest">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
          </span>
          Upcoming
        </h2>

        <h3 className="mt-3 text-2xl font-normal sm:text-3xl">
          {event.emoji && <span className="mr-2">{event.emoji}</span>}
          {event.name}
        </h3>

        <p className="mt-2 text-sm opacity-75">
          {formatLongDate(event.date)}
          {event.location && ` — ${event.location}`}
        </p>

        {event.description && (
          <p className="mt-3 leading-relaxed opacity-80">{event.description}</p>
        )}

        {event.link && (
          <div className="mt-4">
            <a
              href={event.link}
              target="_blank"
              rel="noopener noreferrer"
              className="underline transition-opacity hover:opacity-60"
            >
              Register &#8600;
            </a>
          </div>
        )}
      </article>
    </ScrollReveal>
  );
}

function UpcomingMini({ event, delay }: { event: EventItem; delay: number }) {
  const inner = (
    <article className="group">
      {event.image && (
        <div className="mb-3 overflow-hidden">
          <Image
            src={event.image}
            alt={event.name}
            width={800}
            height={600}
            sizes="(min-width: 768px) 45vw, 100vw"
            className="h-auto w-full transition-opacity group-hover:opacity-80"
            unoptimized
          />
        </div>
      )}
      <h3 className="text-base font-normal">
        {event.emoji && <span className="mr-1">{event.emoji}</span>}
        <span className={event.link ? "underline" : ""}>{event.name}</span>
      </h3>
      <p className="mt-1 text-sm opacity-75">
        {formatShortDate(event.date)}
        {event.location && ` — ${event.location}`}
      </p>
      {event.link && (
        <p className="mt-1 text-sm underline opacity-75">Register &#8600;</p>
      )}
    </article>
  );

  return (
    <ScrollReveal delay={delay}>
      {event.link ? (
        <a
          href={event.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          {inner}
        </a>
      ) : (
        inner
      )}
    </ScrollReveal>
  );
}

function PastEventCard({ event, delay }: { event: EventItem; delay: number }) {
  const inner = (
    <article className="group mb-6 break-inside-avoid">
      {event.image && (
        <div className="mb-2 overflow-hidden">
          <Image
            src={event.image}
            alt={event.name}
            width={800}
            height={600}
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
            className="h-auto w-full transition-opacity group-hover:opacity-80"
            unoptimized
          />
        </div>
      )}
      <h3 className="text-sm font-normal">
        {event.emoji && <span className="mr-1">{event.emoji}</span>}
        <span className={event.link ? "underline" : ""}>{event.name}</span>
      </h3>
      <p className="mt-0.5 text-xs opacity-75">
        {formatShortDate(event.date)}
        {event.location && ` — ${event.location}`}
      </p>
    </article>
  );

  return (
    <ScrollReveal delay={delay}>
      {event.link ? (
        <a
          href={event.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          {inner}
        </a>
      ) : (
        inner
      )}
    </ScrollReveal>
  );
}

export default async function EventsPage() {
  const [upcoming, past] = await Promise.all([
    getUpcomingEvents(),
    getPastEvents(),
  ]);

  const hasEvents = upcoming.length > 0 || past.length > 0;
  const [featured, ...moreUpcoming] = upcoming;

  return (
    <>
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Events" }]} />
      <div className="mx-auto max-w-6xl px-6 pb-16 pt-8">
        <ScrollReveal delay={0}>
          <h1 className="text-sm font-normal uppercase tracking-widest">
            Events
          </h1>
        </ScrollReveal>

        {!hasEvents ? (
          <ScrollReveal delay={0.15}>
            <p className="mt-8 opacity-75">No events yet.</p>
          </ScrollReveal>
        ) : (
          <>
            {featured && <FeaturedUpcoming event={featured} />}

            {moreUpcoming.length > 0 && (
              <section className="mt-12">
                <ScrollReveal delay={0.2}>
                  <h2 className="text-xs font-normal uppercase tracking-widest opacity-75">
                    Also Coming Up
                  </h2>
                </ScrollReveal>
                <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2">
                  {moreUpcoming.map((event, i) => (
                    <UpcomingMini
                      key={event.id}
                      event={event}
                      delay={0.25 + i * 0.05}
                    />
                  ))}
                </div>
              </section>
            )}

            {past.length > 0 && (
              <section className="mt-16">
                <ScrollReveal delay={0.3}>
                  <h2 className="text-xs font-normal uppercase tracking-widest opacity-75">
                    Past
                  </h2>
                </ScrollReveal>
                <div className="mt-6 columns-1 gap-6 sm:columns-2 lg:columns-3">
                  {past.map((event, i) => (
                    <PastEventCard
                      key={event.id}
                      event={event}
                      delay={0.35 + i * 0.03}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </>
  );
}

import { getUpcomingEvents, getPastEvents } from "@/lib/notion-events";
import type { EventItem } from "@/lib/notion-events";
import { ScrollReveal } from "@/components/animations/scroll-reveal";

export const revalidate = 1800; // 30 minutes

export const metadata = {
  title: "Events — Monty Singer",
  description: "Upcoming and past events.",
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "TBD";
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function EventCard({ event, delay }: { event: EventItem; delay: number }) {
  return (
    <ScrollReveal delay={delay}>
      <div className="border border-[var(--border)] rounded-lg p-5">
        {/* Top row: emoji + name */}
        <div className="flex items-center gap-2">
          {event.emoji && (
            <span className="text-base leading-none">{event.emoji}</span>
          )}
          <span className="text-base font-medium">{event.name}</span>
        </div>

        {/* Date + location */}
        <div className="mt-1 text-sm opacity-50">
          {formatDate(event.date)}
          {event.location && (
            <>
              {" · "}
              {event.location}
            </>
          )}
        </div>

        {/* Description */}
        {event.description && (
          <p className="mt-2 text-sm opacity-70">{event.description}</p>
        )}

        {/* RSVP link */}
        {event.link && (
          <a
            href={event.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-sm uppercase tracking-wide opacity-50 hover:opacity-100 transition-opacity"
          >
            RSVP / Details
          </a>
        )}
      </div>
    </ScrollReveal>
  );
}

export default async function EventsPage() {
  const [upcoming, past] = await Promise.all([
    getUpcomingEvents(),
    getPastEvents(),
  ]);

  const hasEvents = upcoming.length > 0 || past.length > 0;

  return (
    <div className="mx-auto max-w-[66ch] px-6 pb-16 pt-24 md:px-0">
      <ScrollReveal delay={0}>
        <h1 className="text-sm font-normal uppercase tracking-widest">
          Events
        </h1>
      </ScrollReveal>

      {!hasEvents ? (
        <ScrollReveal delay={0.15}>
          <p className="mt-8 opacity-50">No events yet.</p>
        </ScrollReveal>
      ) : (
        <>
          {upcoming.length > 0 && (
            <>
              <ScrollReveal delay={0.15}>
                <h2 className="mt-10 text-xs font-normal uppercase tracking-widest opacity-50">
                  Upcoming
                </h2>
              </ScrollReveal>
              <div className="mt-4 flex flex-col gap-4">
                {upcoming.map((event, i) => (
                  <EventCard key={event.id} event={event} delay={0.2 + i * 0.05} />
                ))}
              </div>
            </>
          )}

          {past.length > 0 && (
            <>
              <ScrollReveal delay={upcoming.length > 0 ? 0.3 : 0.15}>
                <h2 className="mt-10 text-xs font-normal uppercase tracking-widest opacity-50">
                  Past
                </h2>
              </ScrollReveal>
              <div className="mt-4 flex flex-col gap-4">
                {past.map((event, i) => (
                  <EventCard key={event.id} event={event} delay={0.35 + i * 0.05} />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

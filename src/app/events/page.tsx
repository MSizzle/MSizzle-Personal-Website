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
  const content = (
    <div className="flex items-start gap-2">
      {event.emoji && (
        <span className="shrink-0 text-lg leading-snug">{event.emoji}</span>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-base font-normal underline transition-opacity group-hover:opacity-60">
            {event.name}
          </h2>
          <span className="shrink-0 text-sm opacity-50">
            {formatDate(event.date)}
          </span>
        </div>

        {event.location && (
          <p className="mt-0.5 text-sm opacity-50">{event.location}</p>
        )}

        {event.description && (
          <p className="mt-1 text-sm opacity-50 line-clamp-2">{event.description}</p>
        )}
      </div>
    </div>
  );

  return (
    <ScrollReveal delay={delay}>
      <div className="py-1">
        {event.link ? (
          <a
            href={event.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            {content}
          </a>
        ) : (
          <div className="group">{content}</div>
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
              <ul className="mt-6 space-y-5">
                {upcoming.map((event, i) => (
                  <li key={event.id}>
                    <EventCard event={event} delay={0.2 + i * 0.05} />
                  </li>
                ))}
              </ul>
            </>
          )}

          {past.length > 0 && (
            <>
              <ScrollReveal delay={upcoming.length > 0 ? 0.3 : 0.15}>
                <h2 className="mt-10 text-xs font-normal uppercase tracking-widest opacity-50">
                  Past
                </h2>
              </ScrollReveal>
              <ul className="mt-6 space-y-5">
                {past.map((event, i) => (
                  <li key={event.id}>
                    <EventCard event={event} delay={0.35 + i * 0.05} />
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </div>
  );
}

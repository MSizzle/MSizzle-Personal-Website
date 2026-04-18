import type { Metadata } from "next";
import { getUpcomingEvents, getPastEvents } from "@/lib/notion-events";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import {
  FeaturedUpcoming,
  UpcomingMini,
  PastEventCard,
} from "@/components/events/event-cards";

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
            {featured && <FeaturedUpcoming event={featured} priority />}

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

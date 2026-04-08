import { EVENTS } from "@/data/events";
import { ScrollReveal } from "@/components/animations/scroll-reveal";

export const metadata = {
  title: "Events — Monty Singer",
  description: "Talks, panels, and events.",
};

export default function EventsPage() {
  return (
    <div className="mx-auto max-w-[66ch] px-6 pb-16 pt-24 md:px-0">
      <ScrollReveal delay={0}>
        <h1 className="text-sm font-normal uppercase tracking-widest">
          Events
        </h1>
      </ScrollReveal>

      {EVENTS.length === 0 ? (
        <ScrollReveal delay={0.15}>
          <p className="mt-8 opacity-50">Events coming soon.</p>
        </ScrollReveal>
      ) : (
        <ScrollReveal delay={0.15}>
          <ul className="mt-8 space-y-6">
            {EVENTS.map((event) => (
              <li key={event.id}>
                {event.url ? (
                  <a
                    href={event.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block"
                  >
                    <h2 className="text-lg underline transition-opacity group-hover:opacity-60">
                      {event.title}
                    </h2>
                    <p className="mt-1 text-base opacity-50">
                      {new Date(event.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                      {event.location && ` · ${event.location}`}
                    </p>
                  </a>
                ) : (
                  <div>
                    <h2 className="text-lg">{event.title}</h2>
                    <p className="mt-1 text-base opacity-50">
                      {new Date(event.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                      {event.location && ` · ${event.location}`}
                    </p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </ScrollReveal>
      )}
    </div>
  );
}

import Image from "next/image";
import type { EventItem } from "@/lib/notion-events";
import { ScrollReveal } from "@/components/animations/scroll-reveal";

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

export function FeaturedUpcoming({
  event,
  delay = 0.15,
  priority = false,
}: {
  event: EventItem;
  delay?: number;
  priority?: boolean;
}) {
  return (
    <ScrollReveal delay={delay}>
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
              priority={priority}
              unoptimized
            />
          </div>
        )}

        <h3 className="flex items-center gap-2 text-xs font-normal uppercase tracking-widest">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
          </span>
          Upcoming
        </h3>

        <h4 className="mt-3 text-2xl font-normal sm:text-3xl">
          {event.emoji && <span className="mr-2">{event.emoji}</span>}
          {event.name}
        </h4>

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

export function UpcomingMini({
  event,
  delay,
}: {
  event: EventItem;
  delay: number;
}) {
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
      <h4 className="text-base font-normal">
        {event.emoji && <span className="mr-1">{event.emoji}</span>}
        <span className={event.link ? "underline" : ""}>{event.name}</span>
      </h4>
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

export function PastEventCard({
  event,
  delay,
}: {
  event: EventItem;
  delay: number;
}) {
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
      <h4 className="text-sm font-normal">
        {event.emoji && <span className="mr-1">{event.emoji}</span>}
        <span className={event.link ? "underline" : ""}>{event.name}</span>
      </h4>
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

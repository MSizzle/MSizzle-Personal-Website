import Link from "next/link";
import type { Metadata } from "next";
import {
  getUpcomingEvents,
  getPastEvents,
  type EventItem,
} from "@/lib/notion-events";
import { formatMonthYear, formatDayNumeral } from "@/lib/dates";
import { PageHero } from "@/components/v3/page-hero";
import { RuleStrong } from "@/components/editorial/rule-strong";
import { SectionLabel } from "@/components/editorial/section-label";
import { AllLink } from "@/components/editorial/all-link";
import { cn } from "@/utils/cn";

// ISR — 30 minutes, matches / and /writing cadence (RESEARCH § Pitfall 9).
export const revalidate = 1800;

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

/**
 * UpcomingRow — inline component for the Upcoming section (D-19: inline-only,
 * /events is the sole consumer). 3-column grid [160px | 1fr | 200px] at md+.
 *
 * Left column:  month/year tracked label + giant 84px (featured) or 56px
 *               (non-featured) bold day numeral — the D-18 signature visual.
 * Middle column: event.location · event.name · optional event.description.
 * Right column:  seat-count meta + AllLink RSVP CTA.
 *
 * Null-safe: formatDayNumeral / formatMonthYear both return "" for null dates
 * (RESEARCH § Pitfall 2 + Plan 11-02).
 */
function UpcomingRow({
  event,
  featured = false,
  last = false,
}: {
  event: EventItem;
  featured?: boolean;
  last?: boolean;
}) {
  const dayNum = formatDayNumeral(event.date);
  const monthYr = formatMonthYear(event.date);
  return (
    <div
      className={cn(
        "grid grid-cols-1 items-baseline gap-6 md:grid-cols-[160px_1fr_200px] md:gap-14",
        featured ? "pb-14" : "py-10",
        !last && "border-b border-[var(--color-border)]"
      )}
    >
      {/* Left: tracked month/year above giant day numeral (D-18) */}
      <div className="leading-none">
        <div className="text-meta uppercase text-[var(--color-text-muted)]">{monthYr}</div>
        <div
          className={cn(
            "mt-2 font-bold leading-[0.9] tracking-[-0.04em] text-[var(--color-text)]",
            featured ? "text-[84px]" : "text-[56px]"
          )}
        >
          {dayNum}
        </div>
      </div>

      {/* Middle: location + title + optional blurb */}
      <div>
        <div className="text-meta uppercase text-[var(--color-text-muted)]">{event.location}</div>
        <div
          className={cn(
            "mt-3 font-bold tracking-[-0.025em] text-[var(--color-text)]",
            featured ? "text-[40px] leading-[1.05]" : "text-event-title"
          )}
        >
          {event.name}
        </div>
        {event.description && (
          <p className="mt-3 max-w-[34rem] text-caption text-[var(--color-text-muted)] md:text-base">
            {event.description}
          </p>
        )}
      </div>

      {/* Right: seat-count meta + RSVP CTA */}
      <div className="md:text-right">
        <div className="mb-3 text-meta uppercase text-[var(--color-text-muted)]">
          {featured ? "Limited seats" : "Open door"}
        </div>
        {event.link && (
          <AllLink href={event.link}>
            {featured ? "Reserve a seat →" : "RSVP →"}
          </AllLink>
        )}
      </div>
    </div>
  );
}

/**
 * /events — editorial events archive page (ARCH-02).
 *
 * Layout per handoff §4 + D-16..D-21:
 *   1. The shared editorial nav is rendered globally via `Navigation` (Path 2) —
 *      "Events" is bolded automatically via the pathname → active-label mapping
 *      there. No inline header is rendered from this page.
 *   2. PageHero — title "Events", crumb "Home / Events", sub line.
 *   3. <RuleStrong />
 *   4. Upcoming section — inline UpcomingRow entries. First event gets the
 *      84px featured day numeral (D-18 signature). Empty state renders when
 *      upcoming === [] (graceful copy with Substack outbound).
 *   5. <RuleStrong />
 *   6. Past section (omitted if empty) — dense 3-col inline rows [120px_1fr_1fr]
 *      per D-20 REVISED (4th status column dropped — EventItem has no status
 *      field per RESEARCH F3). Rows link to event.link ?? "#".
 *
 * Server Component (async). Promise.all over getUpcomingEvents /
 * getPastEvents; both return [] on missing env / API failure (notion-events.ts
 * lines 144-146 + 184-186 verified — no try/catch wrapper needed).
 */
export default async function EventsPage() {
  const [upcoming, past] = await Promise.all([
    getUpcomingEvents(),
    getPastEvents(),
  ]);

  return (
    <>
      {/* PageHero title block */}
      <section className="px-6 md:px-40">
        <PageHero
          title="Events"
          crumb="Home / Events"
          sub="Speaking, panels, and public appearances."
        />
      </section>

      <RuleStrong />

      {/* Upcoming section */}
      <section className="px-6 pt-[120px] pb-[120px] md:px-40">
        <SectionLabel numeral="03 — Upcoming">Upcoming</SectionLabel>
        <div className="mt-[72px]">
          {upcoming.length === 0 ? (
            <p className="text-caption text-[var(--color-text-muted)]">
              Next gathering being planned. Subscribe to{" "}
              <a
                href="https://montymonthly.substack.com"
                target="_blank"
                rel="noopener noreferrer"
                className="border-b border-[var(--color-text)] text-[var(--color-text)]"
              >
                Monty Monthly
              </a>{" "}
              to hear first.
            </p>
          ) : (
            upcoming.map((event, i, arr) => (
              <UpcomingRow
                key={event.id}
                event={event}
                featured={i === 0}
                last={i === arr.length - 1}
              />
            ))
          )}
        </div>
      </section>

      <RuleStrong />

      {/* Past section — omitted entirely when empty */}
      {past.length > 0 && (
        <section className="px-6 pt-[120px] pb-[120px] md:px-40">
          <SectionLabel numeral="03 — Past">Past</SectionLabel>
          <div className="mt-[72px]">
            {past.map((event, i) => (
              <Link
                key={event.id}
                href={event.link ?? "#"}
                className={cn(
                  "grid grid-cols-1 gap-6 py-5 md:grid-cols-[120px_1fr_1fr] md:gap-8",
                  i > 0 && "border-t border-[var(--color-border)]"
                )}
              >
                <span className="text-meta uppercase text-[var(--color-text-muted)]">
                  {formatMonthYear(event.date)}
                </span>
                <span className="text-list-title-home text-[var(--color-text)]">
                  {event.name}
                </span>
                <span className="text-caption text-[var(--color-text-muted)]">
                  {event.description}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

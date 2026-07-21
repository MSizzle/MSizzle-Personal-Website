"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import type { LoveItem } from "@/lib/notion-loves";

/**
 * Pinboard: the "Things I love" treasure-hunt board (sketch 012), plus the
 * shuffle / draw-a-card mechanic (sketch 013).
 *
 * A loose, staggered scatter of overlapping cards you can drag around; a card
 * lifts to the top while dragging and, on a click (no drag), slides up a note
 * telling you why it's here. Places render as polaroids, books as covers,
 * YouTube as thumbnails, hobbies as note cards.
 *
 * A small toolbar (Draw a card / Shuffle) sits above the field. Draw gathers
 * every card to a center deck, riffles the top card, and waits for Stop;
 * stopping dims the rest of the board, centers the winner, and slides its
 * note open (the existing reveal affordance above doubles as the "flip").
 * Shuffle (and "Back to board" after a draw) re-scatters everything at new
 * random positions with the same spring-like transition.
 *
 * Client island: interaction is wired imperatively in an effect against the
 * SSR'd markup (pointer transforms only, no WebGL/Lenis), so the component
 * never re-renders after mount and drag state is never clobbered. Layout is a
 * pure function of index, so server and client agree (no hydration mismatch).
 * The draw/shuffle state (current phase, riffle pointer/timer) is likewise
 * kept in plain closures, not React state, for the same reason.
 *
 * Below 760px it degrades to a tidy, tappable, non-draggable stack (CSS); the
 * draw/shuffle toolbar is hidden there too, since "gather to a center deck"
 * has no meaning once cards are a static vertical list (tap-to-reveal already
 * covers the same "why I love this" payoff on mobile).
 * Every card's link stays reachable via the note panel, so the board is usable
 * without dragging (keyboard + reduced-motion friendly). Under
 * prefers-reduced-motion, scatter/gather/riffle skip their transitions and
 * the riffle's cycling is replaced by an instant, single random pick.
 */

const COLS = 4;
const FIELD_W = 1080; // desktop scatter field inner width (≈ .pinboard-field)
const CARD_MAX_W = 260; // widest card, kept off the right edge
const CARD_MAX_H = 300; // tallest card, kept off the bottom edge
const ROW_H = 300; // ideal vertical step when the board isn't capped
const BOARD_MAX_H = 720; // hard cap: the board never grows past this (fixed area)
const MOBILE_LIMIT = 5; // cards shown before "See more" on the mobile stack
const ROWS = 3; // cards start spread across three horizontal lines
const THREE_LINE_MIN_H = 660; // board floor so the three start lines get real vertical gaps
// The toolbar strip the card field sits below (`--pb-tools-h` in globals.css).
// `boardHeightFor` describes the FIELD height that layoutFor/scatter place
// cards into, so the board element itself must be this much taller or the
// bottom row of cards spills out past the board and onto the footer.
const TOOLS_H = 88;
// Rotation slack: cards are placed by their unrotated box but rendered with up
// to ~11deg of tilt, which pushes a corner past the clamp. Reserved at the
// bottom so a tilted card in the last row still lands inside the board.
const TILT_SLACK = 28;

/** Deterministic 0..1 pseudo-random from an index + salt (SSR-stable). */
function seeded(i: number, salt: number): number {
  const s = ((i + 1) * (salt * 131 + 7) * 9301 + 49297) % 233280;
  return s / 233280;
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(v, hi));

interface Pos {
  x: number;
  y: number;
  r: number;
}

/**
 * Fixed-area board height: grows with item count up to BOARD_MAX_H, then stops.
 * Past the cap, extra rows are compressed into the same area (a denser pile) by
 * layoutFor rather than making the board taller.
 */
function boardHeightFor(n: number): number {
  const rows = Math.max(1, Math.ceil(n / COLS));
  const grid = Math.min(rows * ROW_H + 40, BOARD_MAX_H);
  // Once there are enough cards to fill all three start lines, keep the board
  // tall enough that those lines get real vertical separation (never past the
  // fixed-area cap).
  if (n >= ROWS) return Math.min(BOARD_MAX_H, Math.max(grid, THREE_LINE_MIN_H));
  return grid;
}

/**
 * Scatter position for card `i` of `n`, always within the fixed board area.
 * Cards start spread out along three horizontal lines rather than piled in a
 * center cluster: consecutive cards round-robin across the rows and step evenly
 * across the width, with a little seeded wobble so the lines read as
 * hand-pinned rather than a ruler-straight grid. Deterministic (seeded) so SSR
 * and client agree.
 */
function layoutFor(i: number, n: number): Pos {
  const usableW = FIELD_W - CARD_MAX_W;
  const usableH = Math.max(0, boardHeightFor(n) - CARD_MAX_H);

  const row = i % ROWS; // round-robin down the three lines
  const col = Math.floor(i / ROWS); // position along a line
  const perRow = Math.max(1, Math.ceil(n / ROWS)); // columns in the fullest row

  // Even horizontal spread along each line; a single-column line sits at the
  // left. Jitter is a fraction of the step so cards never crowd back together.
  const stepX = perRow > 1 ? usableW / (perRow - 1) : 0;
  const jitterX = (seeded(i, 1) - 0.5) * Math.min(stepX * 0.28, 34);
  const x = clamp(col * stepX + jitterX, 0, usableW);

  // Three evenly-spaced vertical lines, with a small seeded wobble.
  const stepY = ROWS > 1 ? usableH / (ROWS - 1) : 0;
  const jitterY = (seeded(i, 2) - 0.5) * Math.min(stepY * 0.22, 26);
  const y = clamp(row * stepY + jitterY, 0, usableH);

  const r = seeded(i, 3) * 12 - 6;
  return { x, y, r };
}

/** Muted, on-brand fallback swatches for items with no page cover. */
const SWATCHES = ["#8f9e86", "#7c93a6", "#b9805f", "#c9a14e", "#a49e93", "#8a6f82"];

function coverSrc(item: LoveItem): string | null {
  // A Watch card whose URL points at a video gets the YouTube thumbnail. When
  // the URL is a channel (no parseable video id), fall through to the Notion
  // page cover so a manually-set screenshot still shows instead of a blank swatch.
  if (item.type === "YouTube" && item.youtubeId) {
    return `https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`;
  }
  return item.cover ? `/api/notion-cover?pageId=${item.id}` : null;
}

function tagFor(type: LoveItem["type"]): string {
  if (type === "YouTube") return "Watch";
  if (type === "Book") return "Read";
  if (type === "Movie") return "Film";
  if (type === "Thing") return "Thing";
  return "Place";
}

function CardFace({ item }: { item: LoveItem }) {
  const src = coverSrc(item);
  const tag = tagFor(item.type);
  const idx = SWATCHES.length ? Math.abs(hashId(item.id)) % SWATCHES.length : 0;
  const swatch = SWATCHES[idx];

  const media =
    src != null ? (
      // Plain img on purpose: external YouTube host + same-origin proxy, decorative,
      // below the fold. eslint-disable-next-line @next/next/no-img-element
      <img className="pb-img" src={src} alt="" loading="lazy" draggable={false} />
    ) : (
      <span className="pb-swatch" style={{ background: swatch }} aria-hidden="true" />
    );

  const note = item.note ? (
    <div className="pb-note">
      <button className="pb-close" type="button" aria-label="Close">
        &times;
      </button>
      <p className="pb-note-text">{item.note}</p>
      {item.url ? (
        <a
          className="pb-open"
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open &#8599;
        </a>
      ) : null}
    </div>
  ) : null;

  if (item.type === "Book" || item.type === "Movie") {
    return (
      <div className="pb-frame">
        <div className="pb-media pb-media--book">
          {media}
          <span className="pb-tag">{tag}</span>
          <span className="pb-book-title">{item.title}</span>
          {item.subtitle ? <span className="pb-book-author">{item.subtitle}</span> : null}
        </div>
        <div className="pb-foot">
          <span className="pb-k">{item.type === "Movie" ? "Film" : "Book"}</span>
          <span className="pb-k">&#9825;</span>
        </div>
        {note}
      </div>
    );
  }

  if (item.type === "YouTube") {
    return (
      <div className="pb-frame">
        <div className="pb-media pb-media--yt">
          {media}
          <span className="pb-tag">{tag}</span>
          <span className="pb-play" aria-hidden="true">
            <span />
          </span>
        </div>
        <div className="pb-meta">
          <div className="pb-t">{item.title}</div>
          {item.subtitle ? <div className="pb-c">&#9654; {item.subtitle}</div> : null}
        </div>
        {note}
      </div>
    );
  }

  if (item.type === "Thing") {
    return (
      <div className="pb-frame pb-frame--cream">
        <div className="pb-media pb-media--thing">
          {media}
          <span className="pb-tag">{tag}</span>
        </div>
        <div className="pb-body">
          <div className="pb-t">{item.title}</div>
          {item.subtitle ? <div className="pb-s">{item.subtitle}</div> : null}
        </div>
        {note}
      </div>
    );
  }

  // Place (polaroid)
  return (
    <div className="pb-frame pb-frame--place">
      <div className="pb-media pb-media--place">
        {media}
        <span className="pb-tag">{tag}</span>
      </div>
      <div className="pb-cap">{item.title}</div>
      {note}
    </div>
  );
}

/** Small stable string hash for deterministic swatch choice. */
function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return h;
}

export function Pinboard({
  items,
  categoryOrder = [],
}: {
  items: LoveItem[];
  /** Type-select option order from Notion; orders the Organize-by-topic bands. */
  categoryOrder?: string[];
}) {
  const boardRef = useRef<HTMLDivElement>(null);

  // Board = toolbar strip + field + tilt slack. `boardHeightFor` is the field
  // height alone (what cards are laid out against).
  const boardHeight = boardHeightFor(items.length) + TOOLS_H + TILT_SLACK;

  // Stable string key so the effect re-wires only when the actual order changes.
  const categoryKey = categoryOrder.join("");

  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;

    const isMobile = () => window.matchMedia("(max-width: 760px)").matches;
    const cards = Array.from(board.querySelectorAll<HTMLElement>(".pb-card"));
    let ztop = cards.length + 10;
    const cleanups: Array<() => void> = [];

    cards.forEach((el) => {
      let sx = 0, sy = 0, ox = 0, oy = 0, moved = false, pid: number | null = null;
      const r = parseFloat(el.dataset.r || "0");

      const setXY = (x: number, y: number) => {
        el.dataset.x = String(x);
        el.dataset.y = String(y);
        el.style.transform = `translate(${x}px, ${y}px) rotate(${r}deg)`;
      };

      const onDown = (e: PointerEvent) => {
        if (isMobile()) return;
        if ((e.target as HTMLElement).closest(".pb-close, .pb-open")) return;
        pid = e.pointerId;
        el.setPointerCapture(pid);
        el.classList.add("is-dragging");
        el.style.zIndex = String(++ztop);
        sx = e.clientX; sy = e.clientY;
        ox = parseFloat(el.dataset.x || "0");
        oy = parseFloat(el.dataset.y || "0");
        moved = false;
      };
      const onMove = (e: PointerEvent) => {
        if (pid === null) return;
        const dx = e.clientX - sx, dy = e.clientY - sy;
        if (Math.abs(dx) > 4 || Math.abs(dy) > 4) moved = true;
        setXY(ox + dx, oy + dy);
      };
      const finish = () => {
        if (pid === null) return;
        try { el.releasePointerCapture(pid); } catch {}
        pid = null;
        el.classList.remove("is-dragging");
      };
      const onUp = () => {
        const wasDrag = moved;
        finish();
        if (!wasDrag) {
          el.classList.toggle("is-open");
          el.style.zIndex = String(++ztop);
        }
      };
      const onClick = (e: MouseEvent) => {
        if (!isMobile()) return;
        if ((e.target as HTMLElement).closest(".pb-open")) return;
        if ((e.target as HTMLElement).closest(".pb-close")) {
          el.classList.remove("is-open");
          return;
        }
        el.classList.toggle("is-open");
      };
      const onCloseDown = (e: Event) => {
        e.stopPropagation();
        el.classList.remove("is-open");
      };

      el.addEventListener("pointerdown", onDown);
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerup", onUp);
      el.addEventListener("pointercancel", finish);
      el.addEventListener("click", onClick);
      const closeBtn = el.querySelector(".pb-close");
      closeBtn?.addEventListener("pointerdown", onCloseDown);

      cleanups.push(() => {
        el.removeEventListener("pointerdown", onDown);
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerup", onUp);
        el.removeEventListener("pointercancel", finish);
        el.removeEventListener("click", onClick);
        closeBtn?.removeEventListener("pointerdown", onCloseDown);
      });
    });

    // --- Mobile "See more" -------------------------------------------------
    // On the mobile stack (CSS media query) cards past MOBILE_LIMIT are hidden
    // until this reveals them. Purely a class toggle, no React state, so it
    // never clobbers the imperative card transforms. No-op on desktop, where
    // the button is CSS-hidden and the field is the full scatter.
    const btnMore = board.querySelector<HTMLButtonElement>('[data-pb="more"]');
    const onMore = () => board.classList.add("is-expanded");
    btnMore?.addEventListener("click", onMore);
    cleanups.push(() => btnMore?.removeEventListener("click", onMore));

    // --- Draw a card / Shuffle (sketch 013) --------------------------------
    // Kept as plain closures over the same imperative style as the drag
    // wiring above: no React state, so re-renders never clobber mid-riffle
    // DOM state. All of it is a no-op on mobile, where the toolbar is
    // CSS-hidden and cards are a static list.
    const toolbar = board.querySelector<HTMLElement>(".pb-tools");
    const btnDraw = toolbar?.querySelector<HTMLButtonElement>('[data-pb="draw"]') ?? null;
    const btnShuffle = toolbar?.querySelector<HTMLButtonElement>('[data-pb="shuffle"]') ?? null;
    const btnOrganize = toolbar?.querySelector<HTMLButtonElement>('[data-pb="organize"]') ?? null;
    const btnStop = toolbar?.querySelector<HTMLButtonElement>('[data-pb="stop"]') ?? null;
    const btnAgain = toolbar?.querySelector<HTMLButtonElement>('[data-pb="again"]') ?? null;
    const btnBack = toolbar?.querySelector<HTMLButtonElement>('[data-pb="back"]') ?? null;
    const statusEl = toolbar?.querySelector<HTMLElement>('[data-pb="status"]') ?? null;
    const field = board.querySelector<HTMLElement>(".pinboard-field");

    if (
      toolbar && btnDraw && btnShuffle && btnOrganize && btnStop && btnAgain &&
      btnBack && statusEl && field && cards.length > 0
    ) {
      type Phase = "board" | "drawing" | "revealed";
      let phase: Phase = "board";
      let riffleTimer: ReturnType<typeof setInterval> | null = null;
      let ptr = 0;

      const reduceMotion = () =>
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const rand = (a: number, b: number) => a + Math.random() * (b - a);
      const fieldSize = () => {
        const r = field.getBoundingClientRect();
        return { w: r.width, h: r.height };
      };
      const place = (
        el: HTMLElement,
        x: number,
        y: number,
        r: number,
        s = 1
      ) => {
        el.dataset.x = String(x);
        el.dataset.y = String(y);
        el.style.transform = `translate(${x}px, ${y}px) rotate(${r}deg) scale(${s})`;
      };
      // How big to blow cards up once they leave the board: the gathered deck
      // grows to fill the field, and the drawn winner grows further. Sized to
      // the field (cards are small next to a ~900px board) and capped so a very
      // tall board can't produce an absurd card. Scale is around the card's
      // center (transform-origin: center), so the deck stays centered.
      const DECK_FRAC = 0.52;
      const REVEAL_FRAC = 0.74;
      const SCALE_CAP = 2.6;
      const fitScale = (el: HTMLElement, w: number, h: number, frac: number) => {
        const s = Math.min(
          (w * frac) / el.offsetWidth,
          (h * frac) / el.offsetHeight
        );
        return Math.max(1, Math.min(s, SCALE_CAP));
      };
      const deckPos = (el: HTMLElement, w: number, h: number) => ({
        x: (w - el.offsetWidth) / 2 + rand(-3, 3),
        y: (h - el.offsetHeight) / 2 + rand(-3, 3),
        r: rand(-4, 4),
      });
      const clearCardState = (el: HTMLElement) => {
        el.classList.remove("pb-dim", "pb-peek", "pb-drawn", "pb-riffle", "pb-anim", "is-open");
      };

      const setButtons = (state: Phase) => {
        phase = state;
        btnDraw.hidden = state !== "board";
        btnShuffle.hidden = state !== "board";
        btnOrganize.hidden = state !== "board";
        btnStop.hidden = state !== "drawing";
        btnAgain.hidden = state !== "revealed";
        btnBack.hidden = state !== "revealed";
        if (state === "board") statusEl.textContent = "";
      };

      // Restore the board to its default fixed height and remove any topic
      // labels the "Organize" view added. Called before any layout that owns
      // the field (scatter / draw), so those never inherit the taller,
      // organized board.
      let topicLabels: HTMLElement[] = [];
      const clearTopics = () => {
        topicLabels.forEach((l) => l.remove());
        topicLabels = [];
        board.style.height = `${boardHeightFor(cards.length) + TOOLS_H + TILT_SLACK}px`;
      };

      // Re-scatter every card across the field. Rather than a pure-random
      // position per card (which piles cards on top of each other), assign each
      // card to a distinct, randomly-shuffled grid cell and jitter it within
      // that cell — so Shuffle actually reshuffles positions while spreading the
      // cards over the whole board instead of stacking them.
      const scatter = () => {
        clearTopics();
        const { w, h } = fieldSize();
        const animate = !reduceMotion();

        const n = cards.length;
        const cols = Math.max(1, Math.min(COLS, n));
        const rows = Math.max(1, Math.ceil(n / cols));
        const cellW = w / cols;
        const cellH = h / rows;

        // Fisher–Yates shuffle of the grid cells, so each card lands in its own
        // cell in a fresh random arrangement every Shuffle.
        const cells = Array.from({ length: rows * cols }, (_, k) => k);
        for (let k = cells.length - 1; k > 0; k--) {
          const j = Math.floor(Math.random() * (k + 1));
          [cells[k], cells[j]] = [cells[j], cells[k]];
        }

        cards.forEach((el, i) => {
          clearCardState(el);
          if (animate) el.classList.add("pb-anim");
          const cell = cells[i];
          const cx = cell % cols;
          const cy = Math.floor(cell / cols);
          const maxX = Math.max(0, w - el.offsetWidth);
          const maxY = Math.max(0, h - el.offsetHeight);
          // Anchor to the shuffled cell's center, then spill well past the cell
          // bounds so cards overlap and clump unevenly — a chaotic pile, not a
          // tidy one-per-cell grid. Clamped so nothing leaves the field.
          const baseX = cx * cellW + (cellW - el.offsetWidth) / 2;
          const baseY = cy * cellH + (cellH - el.offsetHeight) / 2;
          const x = clamp(baseX + rand(-cellW * 0.6, cellW * 0.6), 0, maxX);
          const y = clamp(baseY + rand(-cellH * 0.6, cellH * 0.6), 0, maxY);
          // Wilder tilt + fully-random stacking so overlaps look scattered
          // rather than dealt left-to-right.
          place(el, x, y, rand(-11, 11));
          el.style.zIndex = String(10 + Math.floor(Math.random() * cards.length * 3));
        });
        if (animate) {
          window.setTimeout(() => cards.forEach((el) => el.classList.remove("pb-anim")), 560);
        }
      };

      const startDraw = () => {
        if (isMobile() || phase === "drawing") return;
        clearTopics();
        const { w, h } = fieldSize();
        setButtons("drawing");
        statusEl.textContent = "Riffling…";
        cards.forEach(clearCardState);

        if (reduceMotion()) {
          // Instant path: settle on one random card, no cycling flicker.
          cards.forEach((el, i) => {
            const p = deckPos(el, w, h);
            place(el, p.x, p.y, p.r, fitScale(el, w, h, DECK_FRAC));
            el.style.zIndex = String(i + 10);
          });
          ptr = Math.floor(Math.random() * cards.length);
          const el = cards[ptr];
          el.classList.add("pb-peek");
          el.style.zIndex = "300";
          return;
        }

        cards.forEach((el, i) => {
          el.classList.add("pb-anim");
          const p = deckPos(el, w, h);
          place(el, p.x, p.y, p.r, fitScale(el, w, h, DECK_FRAC));
          el.style.zIndex = String(i + 10);
        });

        window.setTimeout(() => {
          cards.forEach((el) => el.classList.remove("pb-anim"));
          ptr = Math.floor(Math.random() * cards.length);
          riffleTimer = setInterval(() => {
            const { w: rw, h: rh } = fieldSize();
            cards.forEach((el) => el.classList.remove("pb-peek"));
            ptr = (ptr + 1) % cards.length;
            const el = cards[ptr];
            el.classList.add("pb-riffle", "pb-peek");
            el.style.zIndex = "300";
            const p = deckPos(el, rw, rh);
            place(el, p.x, p.y - 14, p.r, fitScale(el, rw, rh, DECK_FRAC));
            cards.forEach((o, i) => {
              if (o !== el) o.style.zIndex = String(i + 10);
            });
          }, 80);
        }, 420);
      };

      const stopDraw = () => {
        if (phase !== "drawing") return;
        if (riffleTimer) {
          clearInterval(riffleTimer);
          riffleTimer = null;
        }
        const { w, h } = fieldSize();
        const el = cards[ptr];
        const animate = !reduceMotion();
        cards.forEach((o) => {
          o.classList.remove("pb-riffle", "pb-peek");
          if (o !== el) o.classList.add("pb-dim");
        });
        el.classList.add("pb-drawn");
        if (animate) el.classList.add("pb-anim");
        el.style.zIndex = "500";
        place(
          el,
          (w - el.offsetWidth) / 2,
          (h - el.offsetHeight) / 2 - 20,
          0,
          fitScale(el, w, h, REVEAL_FRAC)
        );
        window.setTimeout(() => el.classList.add("is-open"), animate ? 280 : 0);
        setButtons("revealed");
        statusEl.textContent = "Your card:";
      };

      // Organize by topic: gather the loose scatter into a tidy grid, one
      // labelled row per category. Categories are the raw Notion "Type" value
      // on each card (data-category), so the number of bands adapts to the DB —
      // add a Type option in Notion and it shows up here as its own band. Bands
      // follow Notion's select-option order (categoryOrder); a value missing
      // from that list sorts after, alphabetically; cards with no Type collect
      // in an "Uncategorized" band shown last. Cards keep their drag handlers,
      // so it's still a live board — just sorted. The board grows to fit the
      // grid (an explicit, opt-in view); Shuffle / Draw call clearTopics() to
      // snap back to the fixed-area scatter.
      const UNCATEGORIZED = "Uncategorized";
      const catOf = (el: HTMLElement) =>
        (el.dataset.category ?? "").trim() || UNCATEGORIZED;
      const catRank = (name: string) => {
        if (name === UNCATEGORIZED) return Number.MAX_SAFE_INTEGER;
        const i = categoryOrder.indexOf(name);
        // Known Notion options keep their order; unknown-but-named categories
        // sort just before Uncategorized.
        return i === -1 ? Number.MAX_SAFE_INTEGER - 1 : i;
      };

      const organize = () => {
        if (isMobile() || phase === "drawing") return;
        clearTopics();
        setButtons("board");
        const animate = !reduceMotion();

        const groups = new Map<string, HTMLElement[]>();
        cards.forEach((el) => {
          const c = catOf(el);
          (groups.get(c) ?? groups.set(c, []).get(c)!).push(el);
        });
        const ordered = [...groups.entries()].sort((a, b) => {
          const ra = catRank(a[0]);
          const rb = catRank(b[0]);
          if (ra !== rb) return ra - rb;
          return a[0].localeCompare(b[0]);
        });

        const { w } = fieldSize();
        const LABEL_H = 34; // space above each row for its heading
        const ROW_GAP = 30; // gap below a row before the next heading
        const COL_STEP = 250; // ideal horizontal step within a row
        // The field is absolutely inset to the pinboard's top edge, so it sits
        // under the (z-20) toolbar. Start the first topic row below the
        // toolbar's bottom so its label ("Places") never hides behind the
        // Draw / Shuffle / Organize buttons. Clamps to 6 when there's no
        // overlap (e.g. layouts where the field starts below the tools).
        const fieldTop = field.getBoundingClientRect().top;
        const toolbarBottom = toolbar.getBoundingClientRect().bottom;
        let y = Math.max(6, toolbarBottom - fieldTop + 12);
        let z = 10;

        ordered.forEach(([name, els]) => {
          // Heading for the topic row.
          const label = document.createElement("div");
          label.className = "pb-topic";
          label.textContent = `${name} · ${els.length}`;
          label.style.top = `${y}px`;
          field.appendChild(label);
          topicLabels.push(label);

          const cardsY = y + LABEL_H;
          const cardW = els[0]?.offsetWidth || CARD_MAX_W;
          const perRow = Math.max(1, Math.floor((w + 24) / COL_STEP));
          // If a topic overflows one visual row, let cards overlap horizontally
          // rather than wrapping, so each topic stays a single band.
          const step =
            els.length > 1
              ? Math.min(COL_STEP, (w - cardW) / (els.length - 1))
              : 0;
          let rowH = 0;
          els.forEach((el, i) => {
            clearCardState(el);
            if (animate) el.classList.add("pb-anim");
            // Left-align every band, including single-card bands (step === 0),
            // so a lone card sits at the row's start rather than centered.
            const x = i * step;
            place(el, x, cardsY, seeded(i, 7) * 4 - 2);
            el.style.zIndex = String(++z);
            rowH = Math.max(rowH, el.offsetHeight);
          });
          void perRow; // single-band layout; perRow kept for future wrapping
          y = cardsY + rowH + ROW_GAP;
        });

        // Grow the board to fit the organized grid (bigger than the fixed
        // scatter area on purpose — this is an explicit, expanded view).
        board.style.height = `${y + 20}px`;
        if (animate) {
          window.setTimeout(
            () => cards.forEach((el) => el.classList.remove("pb-anim")),
            560
          );
        }
      };

      const onDrawClick = () => startDraw();
      const onOrganizeClick = () => organize();
      const onShuffleClick = () => {
        if (isMobile() || phase === "drawing") return;
        setButtons("board");
        scatter();
      };
      const onStopClick = () => stopDraw();
      const onAgainClick = () => startDraw();
      const onBackClick = () => {
        if (isMobile()) return;
        setButtons("board");
        scatter();
      };

      btnDraw.addEventListener("click", onDrawClick);
      btnOrganize.addEventListener("click", onOrganizeClick);
      btnShuffle.addEventListener("click", onShuffleClick);
      btnStop.addEventListener("click", onStopClick);
      btnAgain.addEventListener("click", onAgainClick);
      btnBack.addEventListener("click", onBackClick);

      cleanups.push(() => {
        if (riffleTimer) clearInterval(riffleTimer);
        topicLabels.forEach((l) => l.remove());
        btnDraw.removeEventListener("click", onDrawClick);
        btnOrganize.removeEventListener("click", onOrganizeClick);
        btnShuffle.removeEventListener("click", onShuffleClick);
        btnStop.removeEventListener("click", onStopClick);
        btnAgain.removeEventListener("click", onAgainClick);
        btnBack.removeEventListener("click", onBackClick);
      });
    }

    return () => cleanups.forEach((fn) => fn());
    // categoryKey (join of categoryOrder) re-wires organize when the Notion
    // option order changes; categoryOrder itself is read inside the effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, categoryKey]);

  return (
    <div className="pinboard" ref={boardRef} style={{ height: boardHeight }}>
      <div className="pb-tools">
        <button type="button" className="pb-btn pb-btn--go" data-pb="draw">
          Draw a card
        </button>
        <button type="button" className="pb-btn" data-pb="shuffle">
          Shuffle
        </button>
        <button type="button" className="pb-btn" data-pb="organize">
          Organize by topic
        </button>
        <button type="button" className="pb-btn pb-btn--stop" data-pb="stop" hidden>
          Stop
        </button>
        <button type="button" className="pb-btn" data-pb="again" hidden>
          Draw again
        </button>
        <button type="button" className="pb-btn" data-pb="back" hidden>
          Back to board
        </button>
        <span className="pb-status" data-pb="status" />
      </div>
      <div className="pinboard-field">
        {items.map((item, i) => {
          const { x, y, r } = layoutFor(i, items.length);
          return (
            <div
              key={item.id}
              className={`pb-card pb-card--${item.type.toLowerCase()}`}
              data-category={item.category}
              data-x={x}
              data-y={y}
              data-r={r}
              style={
                {
                  transform: `translate(${x}px, ${y}px) rotate(${r}deg)`,
                  zIndex: i + 10,
                  "--pb-r": `${r}deg`,
                } as CSSProperties
              }
            >
              <CardFace item={item} />
            </div>
          );
        })}
      </div>
      {items.length > MOBILE_LIMIT ? (
        <button type="button" className="pb-btn pb-more" data-pb="more">
          See more ({items.length - MOBILE_LIMIT})
        </button>
      ) : null}
    </div>
  );
}

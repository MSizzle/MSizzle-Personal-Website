"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import type { LoveItem } from "@/lib/notion-loves";

/**
 * Pinboard: the "Things I love" treasure-hunt board (sketch 012).
 *
 * A loose, staggered scatter of overlapping cards you can drag around; a card
 * lifts to the top while dragging and, on a click (no drag), slides up a note
 * telling you why it's here. Places render as polaroids, books as covers,
 * YouTube as thumbnails, hobbies as note cards.
 *
 * Client island: interaction is wired imperatively in an effect against the
 * SSR'd markup (pointer transforms only, no WebGL/Lenis), so the component
 * never re-renders after mount and drag state is never clobbered. Layout is a
 * pure function of index, so server and client agree (no hydration mismatch).
 *
 * Below 760px it degrades to a tidy, tappable, non-draggable stack (CSS).
 * Every card's link stays reachable via the note panel, so the board is usable
 * without dragging (keyboard + reduced-motion friendly).
 */

const COLS = 4;
const COL_W = 288; // horizontal step between columns
const ROW_H = 330; // vertical step between rows

/** Deterministic 0..1 pseudo-random from an index + salt (SSR-stable). */
function seeded(i: number, salt: number): number {
  const s = ((i + 1) * (salt * 131 + 7) * 9301 + 49297) % 233280;
  return s / 233280;
}

interface Pos {
  x: number;
  y: number;
  r: number;
}

function layoutFor(i: number): Pos {
  const col = i % COLS;
  const row = Math.floor(i / COLS);
  const x = col * COL_W + (seeded(i, 1) * 48 - 8);
  const y =
    row * ROW_H + (seeded(i, 2) * 64 - 18) + (col % 2 === 0 ? 0 : 26);
  const r = seeded(i, 3) * 10 - 5;
  return { x, y, r };
}

/** Muted, on-brand fallback swatches for items with no page cover. */
const SWATCHES = ["#8f9e86", "#7c93a6", "#b9805f", "#c9a14e", "#a49e93", "#8a6f82"];

function coverSrc(item: LoveItem): string | null {
  if (item.type === "YouTube") {
    return item.youtubeId
      ? `https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`
      : null;
  }
  return item.cover ? `/api/notion-cover?pageId=${item.id}` : null;
}

function tagFor(type: LoveItem["type"]): string {
  if (type === "YouTube") return "Watch";
  if (type === "Book") return "Read";
  if (type === "Hobby") return "Doing";
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

  if (item.type === "Book") {
    return (
      <div className="pb-frame">
        <div className="pb-media pb-media--book">
          {media}
          <span className="pb-tag">{tag}</span>
          <span className="pb-book-title">{item.title}</span>
          {item.subtitle ? <span className="pb-book-author">{item.subtitle}</span> : null}
        </div>
        <div className="pb-foot">
          <span className="pb-k">Book</span>
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

  if (item.type === "Hobby") {
    return (
      <div className="pb-frame pb-frame--cream">
        <div className="pb-media pb-media--hobby">
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

export function Pinboard({ items }: { items: LoveItem[] }) {
  const boardRef = useRef<HTMLDivElement>(null);

  const rows = Math.ceil(items.length / COLS);
  const boardHeight = rows * ROW_H + 240;

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

    return () => cleanups.forEach((fn) => fn());
  }, [items]);

  return (
    <div className="pinboard" ref={boardRef} style={{ minHeight: boardHeight }}>
      <div className="pinboard-field">
        {items.map((item, i) => {
          const { x, y, r } = layoutFor(i);
          return (
            <div
              key={item.id}
              className={`pb-card pb-card--${item.type.toLowerCase()}`}
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
    </div>
  );
}

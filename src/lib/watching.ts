/**
 * Hard-coded watching data for the /watching route (D-07, D-08, D-10).
 *
 * 6 placeholder entries — Monty to swap in real YouTube video IDs before v3 launch.
 * Video IDs are plausible YouTube-format strings for thumbnail URL construction.
 *
 * Thumbnail URL pattern: https://img.youtube.com/vi/{id}/hqdefault.jpg (per D-08)
 * Requires next.config.ts remotePatterns to include img.youtube.com.
 *
 * Pattern: mirrors src/lib/photos.ts (static typed array, no Notion dependency).
 * No helper function needed — page iterates WATCHING_ITEMS directly.
 */

export type WatchingItem = {
  id: string;      // YouTube video ID (from youtu.be/{id})
  title: string;
  channel: string;
  url: string;     // Full YouTube URL: https://www.youtube.com/watch?v={id}
};

export const WATCHING_ITEMS: WatchingItem[] = [
  {
    id: "PLACEHDR001",
    title: "The Philosophy of Building",
    channel: "TODO: [Monty to fill in]",
    url: "https://www.youtube.com/watch?v=PLACEHDR001",
  },
  {
    id: "rStL7niR7gs",
    title: "Design as a Way of Thinking",
    channel: "TODO: [Monty to fill in]",
    url: "https://www.youtube.com/watch?v=rStL7niR7gs",
  },
  {
    id: "aircAruvnKk",
    title: "Why AI Changes Everything",
    channel: "TODO: [Monty to fill in]",
    url: "https://www.youtube.com/watch?v=aircAruvnKk",
  },
  {
    id: "W3I3kAg2J7w",
    title: "Writing to Think Clearly",
    channel: "TODO: [Monty to fill in]",
    url: "https://www.youtube.com/watch?v=W3I3kAg2J7w",
  },
  {
    id: "o8NPllzkFhE",
    title: "Technology and the Human Scale",
    channel: "TODO: [Monty to fill in]",
    url: "https://www.youtube.com/watch?v=o8NPllzkFhE",
  },
  {
    id: "ZXsQAXx_ao0",
    title: "On Entrepreneurship and Meaning",
    channel: "TODO: [Monty to fill in]",
    url: "https://www.youtube.com/watch?v=ZXsQAXx_ao0",
  },
];

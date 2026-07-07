import type { LoveType } from "@/lib/notion-loves";

interface NoteContext {
  title: string;
  type: LoveType;
  subtitle?: string;
  /** Longer synopsis/description from the provider, used for grounding only. */
  context?: string;
}

// Default to the pinned Haiku 4.5 id; override per-deploy with ENRICH_NOTE_MODEL.
const DEFAULT_MODEL = "claude-haiku-4-5-20251001";

const SYSTEM_PROMPT = [
  "You draft a very short personal note for Monty's \"Things I Love\" pinboard on his",
  "personal website. Each note is the \"why I love this\" line shown when a card is",
  "opened.",
  "",
  "Voice: first person, warm but restrained, specific, understated. Sound like a real",
  "person jotting a quick note, not a marketer or a review site.",
  "",
  "Hard rules:",
  "- One or two sentences. Short.",
  "- NEVER use an em dash or en dash. Use commas, periods, or parentheses instead.",
  "- No hype words (\"must-read\", \"must-watch\", \"masterpiece\", \"stunning\", \"a must\").",
  "- No generic filler. Say something concrete about why it stuck.",
  "- Do not restate the title or the author/director; the card already shows those.",
  "- Return ONLY the note text. No quotes, no preamble, no label.",
].join("\n");

/**
 * Draft a Note in Monty's voice from the item metadata. Feature-flagged on
 * ANTHROPIC_API_KEY: with no key (or any failure) it returns null and the Note
 * is left blank for Monty to write himself. Uses the Anthropic Messages API
 * directly (no SDK dependency).
 */
export async function draftNote(ctx: NoteContext): Promise<string | null> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;

  const model = process.env.ENRICH_NOTE_MODEL || DEFAULT_MODEL;

  const userLines = [
    `Type: ${ctx.type}`,
    `Title: ${ctx.title}`,
  ];
  if (ctx.subtitle) userLines.push(`Credit: ${ctx.subtitle}`);
  if (ctx.context) userLines.push(`Reference info: ${ctx.context.slice(0, 800)}`);
  userLines.push("", "Write the note.");

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model,
        max_tokens: 200,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userLines.join("\n") }],
      }),
    });
    if (!res.ok) return null;

    const data = (await res.json()) as {
      content?: { type: string; text?: string }[];
    };
    const raw = (data.content ?? [])
      .map((b) => (b.type === "text" ? b.text ?? "" : ""))
      .join("")
      .trim();
    if (!raw) return null;

    // Safety net: strip any dash the model slipped in, and surrounding quotes.
    const cleaned = raw
      .replace(/\s*[—–]\s*/g, ", ")
      .replace(/^["']|["']$/g, "")
      .trim();

    return cleaned || null;
  } catch {
    return null;
  }
}

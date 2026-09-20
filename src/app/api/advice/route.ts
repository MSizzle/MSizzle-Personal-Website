import { NextResponse } from "next/server";
import { createInboxEntry } from "@/lib/notion-inbox";

// Public endpoint by design. No IP/UA/headers read or stored.
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ error: "method not allowed" }, { status: 405 });
}

/** Helper to extract optional text fields: trim, cap at max length, return undefined if empty/over-cap. */
function optionalText(value: unknown, max: number): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (trimmed.length === 0 || trimmed.length > max) return undefined;
  return trimmed;
}

export async function POST(request: Request) {
  // Parse JSON body.
  const body = await request.json().catch(() => null);
  if (body === null || typeof body !== "object") {
    return NextResponse.json(
      { ok: false, error: "invalid json" },
      { status: 400 }
    );
  }

  // Extract and validate message (required, 1-5000 chars).
  const message =
    typeof body.message === "string" ? body.message.trim() : "";
  if (message.length === 0) {
    return NextResponse.json(
      { ok: false, error: "message required" },
      { status: 400 }
    );
  }
  if (message.length > 5000) {
    return NextResponse.json(
      { ok: false, error: "message too long" },
      { status: 400 }
    );
  }

  // Bot gates: honeypot or timing check before any Notion call.
  if (typeof body.hp === "string" && body.hp.length > 0) {
    return NextResponse.json({ ok: true });
  }
  if (typeof body.t === "number" && body.t < 2500) {
    return NextResponse.json({ ok: true });
  }

  // Extract optional fields.
  const name = optionalText(body.name, 120);
  const contact = optionalText(body.contact, 200);
  const path = optionalText(body.path, 200);

  // Write to Notion.
  try {
    await createInboxEntry({ message, name, contact, path });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("advice: " + (err as Error).message);
    return NextResponse.json(
      { ok: false, error: "could not save" },
      { status: 502 }
    );
  }
}

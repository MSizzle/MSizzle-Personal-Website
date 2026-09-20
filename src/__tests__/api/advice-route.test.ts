import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/notion-inbox", () => ({
  createInboxEntry: vi.fn(async () => undefined),
}));

import { createInboxEntry } from "@/lib/notion-inbox";
import { POST, GET } from "@/app/api/advice/route";

const mockCreate = vi.mocked(createInboxEntry);

beforeEach(() => {
  mockCreate.mockReset().mockResolvedValue(undefined);
});

function post(body: unknown) {
  return POST(
    new Request("http://localhost/api/advice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: typeof body === "string" ? body : JSON.stringify(body),
    })
  );
}

describe("POST /api/advice", () => {
  it("valid message creates entry with trimmed fields", async () => {
    const res = await post({
      message: "  hello there  ",
      name: " Monty ",
      contact: " m@x.com ",
      path: "/contact",
      t: 9000,
    });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(mockCreate).toHaveBeenCalledOnce();
    expect(mockCreate).toHaveBeenCalledWith({
      message: "hello there",
      name: "Monty",
      contact: "m@x.com",
      path: "/contact",
    });
  });

  it("empty trimmed message returns 400", async () => {
    const res = await post({ message: "   " });
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("message required");
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("message over 5000 chars returns 400", async () => {
    const res = await post({ message: "a".repeat(5001) });
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("message too long");
  });

  it("honeypot filled returns 200 silently without calling createInboxEntry", async () => {
    const res = await post({ message: "hi", hp: "http://spam" });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("timing gate (t < 2500) returns 200 silently", async () => {
    const res = await post({ message: "hi", t: 1000 });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("createInboxEntry error returns 502", async () => {
    mockCreate.mockRejectedValueOnce(new Error("boom"));
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await post({ message: "hi", t: 9000 });
    expect(res.status).toBe(502);
    const json = await res.json();
    expect(json.error).toBe("could not save");
    spy.mockRestore();
  });

  it("invalid JSON body returns 400", async () => {
    const res = await post("{not json");
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("invalid json");
  });
});

describe("GET /api/advice", () => {
  it("returns 405 method not allowed", async () => {
    const res = await GET();
    expect(res.status).toBe(405);
    const json = await res.json();
    expect(json.error).toBe("method not allowed");
  });
});

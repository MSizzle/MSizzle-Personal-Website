import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";

vi.mock("motion/react", () => ({
  m: {
    div: ({ children, initial, animate, exit, transition, ...props }: any) =>
      <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useReducedMotion: () => false,
}));

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

beforeEach(() => {
  cleanup();
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({ ok: true }))
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

import { AdviceForm } from "@/components/advice/advice-form";

describe("AdviceForm", () => {
  it("renders stage 1: message prompt with focused textarea", async () => {
    render(<AdviceForm />);
    expect(screen.getByText("What's on your mind?")).toBeDefined();
    const textarea = screen.getByLabelText("What's on your mind?");
    expect(textarea).toBeDefined();
    // Focus effect runs synchronously after render under act().
    expect(document.activeElement).toBe(textarea);
  });

  it("Enter with empty message does nothing", () => {
    render(<AdviceForm />);
    const textarea = screen.getByLabelText("What's on your mind?");
    fireEvent.keyDown(textarea, { key: "Enter" });
    expect(screen.queryByText("Want a reply?")).toBeNull();
    expect(screen.getByText("What's on your mind?")).toBeDefined();
  });

  it("typing and Enter advances to stage 2", async () => {
    render(<AdviceForm />);
    const textarea = screen.getByLabelText("What's on your mind?");
    fireEvent.change(textarea, { target: { value: "hello" } });
    fireEvent.keyDown(textarea, { key: "Enter" });
    await screen.findByText("Want a reply?");
    expect(screen.queryByText("What's on your mind?")).toBeNull();
  });

  it("Send anonymously clears name/contact and calls fetch with empty strings", async () => {
    render(<AdviceForm />);
    const textarea = screen.getByLabelText("What's on your mind?");
    fireEvent.change(textarea, { target: { value: "hello" } });
    fireEvent.keyDown(textarea, { key: "Enter" });
    await screen.findByText("Want a reply?");

    const nameInput = screen.getByLabelText("Name");
    fireEvent.change(nameInput, { target: { value: "Monty" } });

    fireEvent.click(screen.getByText("Send anonymously"));
    await screen.findAllByText("Sent.");

    const [url, init] = vi.mocked(fetch).mock.calls[0];
    expect(url).toBe("/api/advice");
    const body = JSON.parse(String(init?.body));
    expect(body.message).toBe("hello");
    expect(body.name).toBe("");
    expect(body.contact).toBe("");
    expect(typeof body.t).toBe("number");
  });

  it("fetch rejection shows error and preserves message after Back", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error("net error"));
    render(<AdviceForm />);
    const textarea = screen.getByLabelText("What's on your mind?");
    fireEvent.change(textarea, { target: { value: "keep me" } });
    fireEvent.keyDown(textarea, { key: "Enter" });
    await screen.findByText("Want a reply?");

    fireEvent.click(screen.getByText("Send"));
    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toContain("Did not send");

    fireEvent.click(screen.getByText("Back"));
    await waitFor(() => {
      expect(screen.getByLabelText("What's on your mind?")).toHaveValue("keep me");
    });
  });
});

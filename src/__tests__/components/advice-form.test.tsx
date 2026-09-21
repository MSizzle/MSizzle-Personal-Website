import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";

type MockProps = { children?: ReactNode; [key: string]: unknown };

vi.mock("motion/react", () => ({
  m: {
    div: (props: MockProps) => {
      const rest = { ...props };
      for (const k of ["initial", "animate", "exit", "transition"]) delete rest[k];
      const { children, ...attrs } = rest;
      return <div {...attrs}>{children}</div>;
    },
  },
  AnimatePresence: ({ children }: MockProps) => <>{children}</>,
  useReducedMotion: () => false,
}));

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: MockProps & { href: string }) => (
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
  it("renders the prompt with the textarea focused and no reply fields", () => {
    render(<AdviceForm />);
    const textarea = screen.getByLabelText("What's on your mind?");
    expect(document.activeElement).toBe(textarea);
    expect(screen.getByText("Submit")).toBeDefined();
    expect(screen.queryByPlaceholderText("Name")).toBeNull();
  });

  it("Enter with an empty message does not submit", () => {
    render(<AdviceForm />);
    const textarea = screen.getByLabelText("What's on your mind?");
    fireEvent.keyDown(textarea, { key: "Enter" });
    expect(vi.mocked(fetch)).not.toHaveBeenCalled();
    expect(screen.getByText("What's on your mind?")).toBeDefined();
  });

  it("Want a reply? reveals the Name and Email lines", () => {
    render(<AdviceForm />);
    fireEvent.click(screen.getByText("Want a reply?"));
    expect(screen.getByPlaceholderText("Name")).toBeDefined();
    expect(screen.getByPlaceholderText("Email")).toBeDefined();
    expect(screen.queryByPlaceholderText("Email or handle")).toBeNull();
  });

  it("Enter submits anonymously when the reply toggle is closed", async () => {
    render(<AdviceForm />);
    const textarea = screen.getByLabelText("What's on your mind?");
    fireEvent.change(textarea, { target: { value: "hello" } });
    fireEvent.keyDown(textarea, { key: "Enter" });
    await screen.findAllByText("Sent.");

    const [url, init] = vi.mocked(fetch).mock.calls[0];
    expect(url).toBe("/api/advice");
    const body = JSON.parse(String(init?.body));
    expect(body.message).toBe("hello");
    expect(body.name).toBe("");
    expect(body.contact).toBe("");
    expect(typeof body.t).toBe("number");
  });

  it("Submit sends name and email when the reply toggle is open", async () => {
    render(<AdviceForm />);
    fireEvent.change(screen.getByLabelText("What's on your mind?"), {
      target: { value: "hello" },
    });
    fireEvent.click(screen.getByText("Want a reply?"));
    fireEvent.change(screen.getByPlaceholderText("Name"), { target: { value: "Monty" } });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "m@example.com" },
    });
    fireEvent.click(screen.getByText("Submit"));
    await screen.findAllByText("Sent.");

    const body = JSON.parse(String(vi.mocked(fetch).mock.calls[0][1]?.body));
    expect(body.name).toBe("Monty");
    expect(body.contact).toBe("m@example.com");
  });

  it("fetch rejection shows the error line and keeps the message", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error("net error"));
    render(<AdviceForm />);
    const textarea = screen.getByLabelText("What's on your mind?");
    fireEvent.change(textarea, { target: { value: "keep me" } });
    fireEvent.click(screen.getByText("Submit"));
    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toContain("Did not send");
    await waitFor(() =>
      expect((screen.getByLabelText("What's on your mind?") as HTMLTextAreaElement).value).toBe(
        "keep me"
      )
    );
  });
});

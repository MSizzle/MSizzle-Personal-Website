import React from "react";
import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { ContactRow } from "@/components/v3/contact-row";

afterEach(() => cleanup());

describe("ContactRow", () => {
  it("gives the title div group-hover:text-bg, matching the numeral/handle/action siblings", () => {
    const { container } = render(
      React.createElement(ContactRow, {
        numeral: "01",
        title: "Email",
        href: "mailto:monty@prometheus.today",
        handle: "@themontysinger",
        action: "Copy",
      })
    );

    const row = container.querySelector("a.group");
    expect(row).not.toBeNull();

    // Title div: the specific fix under test.
    const titleDiv = row!.querySelector("div > div.font-display");
    expect(titleDiv).not.toBeNull();
    expect(titleDiv!.className).toContain("group-hover:text-bg");

    // Non-regressing baseline: numeral, handle, action already carry the class.
    const numeralSpan = row!.querySelector("span.font-mono.text-sm.text-text-muted");
    expect(numeralSpan?.className).toContain("group-hover:text-bg");

    const handleSpan = row!.querySelector("span.block.font-sans");
    expect(handleSpan?.className).toContain("group-hover:text-bg");

    const actionSpan = row!.querySelector("span.font-mono.text-xs.uppercase");
    expect(actionSpan?.className).toContain("group-hover:text-bg");
  });

  it("the outer <a> carries the group class the group-hover: variants depend on", () => {
    const { container } = render(
      React.createElement(ContactRow, {
        numeral: "02",
        title: "X / Twitter",
        href: "https://x.com/themontysinger",
        external: true,
      })
    );

    const row = container.querySelector("a");
    expect(row?.className).toContain("group");
  });
});

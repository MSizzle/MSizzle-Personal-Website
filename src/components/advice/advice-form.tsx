"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import Link from "next/link";
import { m, AnimatePresence, useReducedMotion } from "motion/react";

/**
 * Single-page anonymous advice form.
 *
 * One prompt ("What's on your mind?"), one Submit. A small "Want a reply?"
 * toggle under the button opens optional Name and Email lines. Blank name and
 * email means anonymous; nothing is derived from either. After a successful
 * send the page swaps to a short "Sent." state.
 *
 * Uses m.div (the site's MotionProvider runs LazyMotion in strict mode, which
 * rejects motion.div). A honeypot field plus a time-on-page value give the API
 * route two cheap bot gates.
 */
export function AdviceForm() {
  const [stage, setStage] = useState<"form" | "done">("form");
  const [message, setMessage] = useState("");
  const [wantReply, setWantReply] = useState(false);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [hp, setHp] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);
  const [focused, setFocused] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const doneLinkRef = useRef<HTMLAnchorElement>(null);
  const mountTime = useRef(Date.now());

  const reduced = useReducedMotion();
  const dy = reduced ? 0 : 8;
  const duration = reduced ? 0 : 0.15;

  useEffect(() => {
    if (stage === "form") textareaRef.current?.focus();
    else doneLinkRef.current?.focus();
  }, [stage]);

  useEffect(() => {
    if (wantReply) nameInputRef.current?.focus();
  }, [wantReply]);

  function grow(el: HTMLTextAreaElement) {
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }

  useEffect(() => {
    if (textareaRef.current) grow(textareaRef.current);
  }, [message, stage]);

  const canSubmit = message.trim().length > 0 && !pending;

  function onMessageKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSubmit) void submit();
    }
  }

  async function submit() {
    if (!canSubmit) return;

    let path = "";
    try {
      const ref = new URL(document.referrer);
      if (ref.origin === window.location.origin) path = ref.pathname;
    } catch {
      // no usable referrer
    }

    setPending(true);
    setError(false);
    try {
      const res = await fetch("/api/advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          name: wantReply ? name : "",
          contact: wantReply ? contact : "",
          path,
          hp,
          t: Date.now() - mountTime.current,
        }),
      });
      if (res.ok) setStage("done");
      else setError(true);
    } catch {
      setError(true);
    } finally {
      setPending(false);
    }
  }

  const fieldClass =
    "advice-field block w-full border-0 border-b border-text bg-transparent px-0 pb-2 text-lg md:text-xl text-text outline-none";

  return (
    <div
      className="flex min-h-[calc(100dvh-var(--header-h))] items-center bg-bg px-6 md:px-40"
      onClick={(e) => {
        // Clicking the empty page focuses the prompt; clicks on controls keep their target.
        if (stage === "form" && e.target === e.currentTarget) textareaRef.current?.focus();
      }}
    >
      <div className="w-full max-w-[62ch] mx-auto">
        <AnimatePresence mode="wait">
          {stage === "form" && (
            <m.div
              key="form"
              initial={{ opacity: 0, y: dy }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -dy }}
              transition={{ duration }}
            >
              <form
                onSubmit={(e: FormEvent) => {
                  e.preventDefault();
                  void submit();
                }}
              >
                <label
                  htmlFor="advice-message"
                  className="font-mono text-sm text-text-muted"
                >
                  What&apos;s on your mind?
                </label>
                <div className="relative mt-4 font-sans text-xl md:text-2xl leading-snug">
                  {message.length === 0 && !focused && (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute left-0 top-[0.15em] h-[1.1em] w-[2px] bg-text animate-[advice-blink_1s_steps(1,end)_infinite]"
                    />
                  )}
                  <textarea
                    id="advice-message"
                    ref={textareaRef}
                    rows={1}
                    value={message}
                    className="advice-field block w-full resize-none overflow-hidden border-0 bg-transparent p-0 text-text outline-none"
                    style={{ caretColor: "var(--color-text)" }}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    onChange={(e) => setMessage(e.target.value)}
                    onInput={(e) => grow(e.currentTarget)}
                    onKeyDown={onMessageKeyDown}
                  />
                </div>

                <div className="mt-6 flex items-center justify-between gap-6">
                  <button
                    type="button"
                    aria-pressed={wantReply}
                    onClick={() => setWantReply((v) => !v)}
                    className="group inline-flex items-center gap-2 font-mono text-xs text-text-muted hover:text-text"
                  >
                    <span
                      aria-hidden="true"
                      className={
                        "inline-block h-3 w-3 border border-text " +
                        (wantReply ? "bg-text" : "bg-transparent")
                      }
                    />
                    Want a reply?
                  </button>
                  <button
                    type="submit"
                    disabled={!canSubmit}
                    aria-busy={pending}
                    className="font-mono text-sm underline-offset-4 hover:underline disabled:opacity-40 disabled:no-underline"
                  >
                    Submit
                  </button>
                </div>

                <AnimatePresence initial={false}>
                  {wantReply && (
                    <m.div
                      key="reply"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration }}
                      className="overflow-hidden"
                    >
                      <p className="mt-6 font-mono text-xs text-text-muted">
                        Leave a name, an email, or both.
                      </p>
                      <div className="mt-4 space-y-4">
                        <input
                          id="advice-name"
                          ref={nameInputRef}
                          type="text"
                          placeholder="Name"
                          aria-label="Name"
                          autoComplete="off"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className={fieldClass}
                        />
                        <input
                          id="advice-contact"
                          type="text"
                          placeholder="Email"
                          aria-label="Email"
                          autoComplete="off"
                          value={contact}
                          onChange={(e) => setContact(e.target.value)}
                          className={fieldClass}
                        />
                      </div>
                    </m.div>
                  )}
                </AnimatePresence>

                <p className="mt-6 font-mono text-xs text-text-muted">
                  Enter to submit. Shift+Enter for a new line.
                </p>
                <p className="mt-4 font-mono text-xs text-text-muted">
                  Anonymous by default. No account, no IP logged.
                </p>
                {error && (
                  <p role="alert" className="mt-4 font-mono text-xs text-text">
                    Did not send. Try again, or email monty@prometheus.today.
                  </p>
                )}
              </form>
            </m.div>
          )}

          {stage === "done" && (
            <m.div
              key="done"
              initial={{ opacity: 0, y: dy }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -dy }}
              transition={{ duration }}
            >
              <p className="font-mono text-sm text-text-muted">Sent.</p>
              <p className="mt-1 text-text-dim">
                It lands in a Notion database I actually read.
              </p>
              <Link
                ref={doneLinkRef}
                href="/"
                className="mt-6 inline-block font-mono text-sm underline-offset-4 hover:underline"
              >
                Back to home
              </Link>
              <pre className="mt-10 whitespace-pre-wrap font-sans text-text-dim">
                {message}
              </pre>
            </m.div>
          )}
        </AnimatePresence>
      </div>

      {/* Honeypot */}
      <div
        className="absolute -left-[9999px] h-px w-px overflow-hidden"
        aria-hidden="true"
      >
        <input
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={hp}
          onChange={(e) => setHp(e.target.value)}
        />
      </div>

      <div aria-live="polite" className="sr-only">
        {stage === "done" ? "Sent." : ""}
      </div>
    </div>
  );
}

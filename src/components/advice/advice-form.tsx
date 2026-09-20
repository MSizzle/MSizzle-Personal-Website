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
 * Three-state anonymous advice form: message | reply | done.
 * Uses motion/react for AnimatePresence (not motion/react's motion.div,
 * which requires LazyMotion strict mode). Honeypot + timing gate prevent bots.
 */
export function AdviceForm() {
  const [stage, setStage] = useState<"message" | "reply" | "done">("message");
  const [message, setMessage] = useState("");
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

  // Focus the first interactive element of the current stage.
  useEffect(() => {
    if (stage === "message") {
      textareaRef.current?.focus();
    } else if (stage === "reply") {
      nameInputRef.current?.focus();
    } else if (stage === "done") {
      doneLinkRef.current?.focus();
    }
  }, [stage]);

  // Auto-grow textarea.
  function grow(el: HTMLTextAreaElement) {
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }

  useEffect(() => {
    if (textareaRef.current) {
      grow(textareaRef.current);
    }
  }, [message, stage]);

  function onMessageKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (message.trim().length > 0) {
        setStage("reply");
      }
    }
  }

  async function submit(anonymous: boolean) {
    const n = anonymous ? "" : name;
    const c = anonymous ? "" : contact;
    if (anonymous) {
      setName("");
      setContact("");
    }

    let path = "";
    try {
      const ref = new URL(document.referrer);
      if (ref.origin === window.location.origin) {
        path = ref.pathname;
      }
    } catch {
      // fall through
    }

    setPending(true);
    setError(false);
    try {
      const res = await fetch("/api/advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          name: n,
          contact: c,
          path,
          hp,
          t: Date.now() - mountTime.current,
        }),
      });
      if (res.ok) {
        setStage("done");
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setPending(false);
    }
  }

  return (
    <div
      className="flex min-h-[calc(100dvh-var(--header-h))] items-center bg-bg px-6 md:px-40"
      onClick={() => {
        if (stage === "message") textareaRef.current?.focus();
      }}
    >
      <div className="w-full max-w-[62ch] mx-auto">
        <AnimatePresence mode="wait">
          {stage === "message" && (
            <m.div
              key="message"
              initial={{ opacity: 0, y: dy }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -dy }}
              transition={{ duration }}
            >
              <label
                htmlFor="advice-message"
                className="font-mono text-sm text-text-muted"
              >
                What's on your mind?
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
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  disabled={message.trim().length === 0}
                  onClick={() => setStage("reply")}
                  className="font-mono text-sm underline-offset-4 hover:underline disabled:opacity-40 disabled:no-underline"
                >
                  Continue
                </button>
              </div>
              <p className="mt-4 font-mono text-xs text-text-muted">
                Enter to continue. Shift+Enter for a new line.
              </p>
              <p className="mt-4 font-mono text-xs text-text-muted">
                Anonymous by default. No account, no IP logged.
              </p>
            </m.div>
          )}

          {stage === "reply" && (
            <m.div
              key="reply"
              initial={{ opacity: 0, y: dy }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -dy }}
              transition={{ duration }}
            >
              <label
                htmlFor="advice-name"
                className="font-mono text-sm text-text-muted"
              >
                Want a reply?
              </label>
              <p className="mt-1 text-text-dim">
                Leave a name, a contact, or both. Or neither.
              </p>
              <form
                onSubmit={(e: FormEvent) => {
                  e.preventDefault();
                  submit(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    e.preventDefault();
                    setStage("message");
                  }
                }}
              >
                <div className="mt-6 space-y-4">
                  <input
                    id="advice-name"
                    ref={nameInputRef}
                    type="text"
                    placeholder="Name"
                    aria-label="Name"
                    autoComplete="off"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="advice-field block w-full border-0 bg-transparent p-0 text-lg md:text-xl text-text outline-none"
                  />
                  <input
                    id="advice-contact"
                    type="text"
                    placeholder="Email or handle"
                    aria-label="Email or handle"
                    autoComplete="off"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="advice-field block w-full border-0 bg-transparent p-0 text-lg md:text-xl text-text outline-none"
                  />
                </div>
                <div className="mt-8 flex items-center gap-6">
                  <button
                    type="submit"
                    disabled={pending}
                    aria-busy={pending}
                    className="font-mono text-sm underline-offset-4 hover:underline disabled:opacity-40"
                  >
                    Send
                  </button>
                  <button
                    type="button"
                    disabled={pending}
                    aria-busy={pending}
                    onClick={() => submit(true)}
                    className="font-mono text-sm underline-offset-4 hover:underline disabled:opacity-40"
                  >
                    Send anonymously
                  </button>
                  <button
                    type="button"
                    onClick={() => setStage("message")}
                    className="ml-auto font-mono text-xs text-text-muted hover:underline"
                  >
                    Back
                  </button>
                </div>
                {error && (
                  <p
                    role="alert"
                    className="mt-4 font-mono text-xs text-text"
                  >
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

      {/* Accessibility announcement */}
      <div aria-live="polite" className="sr-only">
        {stage === "done" ? "Sent." : ""}
      </div>
    </div>
  );
}

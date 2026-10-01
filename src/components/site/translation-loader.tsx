"use client";

import { useEffect, useState } from "react";
import { languageList } from "@/lib/region";
import { protectReactFromTranslator, setTranslationTarget } from "@/lib/translate";
import { useRegion } from "@/lib/use-region";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: { translate: { TranslateElement: new (options: object, elementId: string) => unknown } };
  }
}

const SCRIPT_ID = "google-translate-script";
const POLL_MS = 400;
/** Google's response time varies a lot (seconds to tens of seconds), so give it a generous window. */
const GIVE_UP_MS = 60_000;

/** `pending` until the first translated text appears; `hidden` once the pill has nothing left to say. */
type Outcome = "pending" | "translated" | "failed" | "hidden";

/**
 * Loads Google's website translator, but only for visitors who chose Yoruba, Igbo or Hausa - everyone
 * else never touches a Google script. The `googtrans` cookie it reads is a session cookie, so this
 * re-sets it on every load from the saved language preference (which lasts a year).
 *
 * Translation can take a while to arrive, so a small status pill shows until the first translated
 * text appears (the translator wraps translated text in <font>), rather than leaving the visitor
 * staring at English wondering whether their choice worked.
 */
export function TranslationLoader() {
  const { ready, language } = useRegion();
  const [outcome, setOutcome] = useState<Outcome>("pending");
  const active = ready && language !== "en";

  useEffect(() => {
    if (!ready || language === "en") return;

    protectReactFromTranslator();
    setTranslationTarget(language);

    // Injection is idempotent (React runs effects twice in development); the poll below is not skipped.
    if (!document.getElementById(SCRIPT_ID)) {
      window.googleTranslateElementInit = () => {
        if (!window.google) return;
        new window.google.translate.TranslateElement(
          { pageLanguage: "en", includedLanguages: "yo,ig,ha", autoDisplay: false },
          "google_translate_element",
        );
      };

      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.head.appendChild(script);
    }

    const started = Date.now();
    const poll = window.setInterval(() => {
      if (document.querySelector("font")) {
        setOutcome("translated");
        window.clearInterval(poll);
      } else if (Date.now() - started > GIVE_UP_MS) {
        setOutcome("failed");
        window.clearInterval(poll);
        window.setTimeout(() => setOutcome("hidden"), 10_000);
      }
    }, POLL_MS);
    return () => window.clearInterval(poll);
  }, [ready, language]);

  const name = languageList.find((l) => l.id === language)?.native;

  return (
    <>
      {/* The widget needs an element to mount into; its own UI is hidden (see globals.css). */}
      <div id="google_translate_element" className="hidden" />
      {active && (outcome === "pending" || outcome === "failed") && (
        <div
          role="status"
          translate="no"
          className="fixed bottom-4 left-1/2 z-50 flex max-w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-3 rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-ink/30"
        >
          {outcome === "pending" ? (
            <>
              <span aria-hidden className="size-4 shrink-0 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              <span className="whitespace-nowrap">Translating to {name}…</span>
            </>
          ) : (
            "Translation isn't available right now, so the site is showing in English."
          )}
        </div>
      )}
    </>
  );
}

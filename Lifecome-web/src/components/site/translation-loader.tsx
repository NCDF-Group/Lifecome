"use client";

import { useEffect } from "react";
import { protectReactFromTranslator, setTranslationTarget } from "@/lib/translate";
import { useRegion } from "@/lib/use-region";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: { translate: { TranslateElement: new (options: object, elementId: string) => unknown } };
  }
}

const SCRIPT_ID = "google-translate-script";

/**
 * Loads Google's website translator, but only for visitors who chose Yoruba, Igbo or Hausa - everyone
 * else never touches a Google script. The `googtrans` cookie it reads is a session cookie, so this
 * re-sets it on every load from the saved language preference (which lasts a year).
 */
export function TranslationLoader() {
  const { ready, language } = useRegion();

  useEffect(() => {
    if (!ready || language === "en" || document.getElementById(SCRIPT_ID)) return;

    protectReactFromTranslator();
    setTranslationTarget(language);

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
  }, [ready, language]);

  // The widget needs an element to mount into; its own UI is hidden (see globals.css).
  return <div id="google_translate_element" className="hidden" />;
}

import type Lenis from "lenis";

let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

/** Smooth scroll to the top via Lenis, falling back to native smooth scrolling (or instant for reduced motion). */
export function scrollToTop() {
  if (instance) {
    instance.scrollTo(0, { duration: 1.2 });
    return;
  }
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
}

/** Freezes the page behind a modal. Lenis handles wheel events itself, so `overflow: hidden` alone isn't enough. */
export function pauseScroll() {
  instance?.stop();
}

export function resumeScroll() {
  instance?.start();
}

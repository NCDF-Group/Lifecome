"use client";

import { useEffect, useState } from "react";
import { scrollToTop } from "@/lib/smooth-scroll";

const SHOW_AFTER_PX = 600;

/** Floating "back to top" button. Appears after scrolling down and scrolls smoothly back up. */
export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER_PX);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`fixed bottom-5 right-5 z-40 grid size-12 place-items-center rounded-full bg-blue text-white shadow-lg shadow-blue/30 transition duration-300 ease-smooth hover:-translate-y-1 hover:bg-blue-strong hover:shadow-xl active:scale-95 sm:bottom-8 sm:right-8 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <svg aria-hidden viewBox="0 0 16 16" className="size-5">
        <path d="M8 13V3m-4 4 4-4 4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

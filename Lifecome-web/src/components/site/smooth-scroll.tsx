"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { setLenis } from "@/lib/smooth-scroll";

/** Inertial smooth scrolling. Lenis honours prefers-reduced-motion by default. */
export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({ autoRaf: true, anchors: true, lerp: 0.1 });
    setLenis(lenis);
    return () => {
      setLenis(null);
      lenis.destroy();
    };
  }, []);

  return null;
}

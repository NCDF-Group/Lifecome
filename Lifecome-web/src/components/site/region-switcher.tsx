"use client";

import { useEffect, useRef, useState } from "react";
import { regionList, regions } from "@/lib/region";
import { setRegion, useRegion } from "@/lib/use-region";

function Globe() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" />
    </svg>
  );
}

/**
 * Lets a visitor change region at any time. `menu` is the desktop header dropdown; `inline` lays the
 * options out as buttons for the mobile menu, where a nested popover would be awkward.
 */
export function RegionSwitcher({ variant = "menu" }: { variant?: "menu" | "inline" }) {
  const { region } = useRegion();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (variant === "inline") {
    return (
      <div role="group" aria-label="Region" className="flex flex-wrap gap-2">
        {regionList.map((r) => (
          <button
            key={r.id}
            type="button"
            aria-pressed={region === r.id}
            onClick={() => setRegion(r.id)}
            className={`inline-flex min-h-11 items-center gap-2 rounded-control border-2 px-4 font-semibold ${
              region === r.id ? "border-link bg-link text-white" : "border-line text-ink hover:bg-surface"
            }`}
          >
            <Globe />
            {r.name}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="region-menu"
        aria-label={`Region: ${regions[region].name}. Change region`}
        onClick={() => setOpen((o) => !o)}
        className="flex min-h-11 items-center gap-1.5 rounded-control px-3 text-sm font-semibold text-ink hover:bg-surface"
      >
        <Globe />
        {regions[region].shortName}
      </button>
      {open && (
        <ul id="region-menu" className="absolute right-0 top-full mt-2 w-52 rounded-card border border-line bg-card p-2 shadow-xl shadow-ink/10">
          {regionList.map((r) => (
            <li key={r.id}>
              <button
                type="button"
                aria-current={region === r.id ? "true" : undefined}
                onClick={() => {
                  setRegion(r.id);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between rounded-control px-3 py-2.5 text-left text-sm font-medium text-ink hover:bg-surface hover:text-link"
              >
                {r.name}
                {region === r.id && (
                  <svg aria-hidden viewBox="0 0 16 16" className="size-4 text-positive">
                    <path d="m3 8.5 3.2 3L13 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

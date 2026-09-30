"use client";

import { useEffect, useRef, useState } from "react";
import { Flag } from "@/components/ui/flag";
import { languageList, regionList, regions } from "@/lib/region";
import { setLanguage, setRegion, useRegion } from "@/lib/use-region";

function Check() {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className="size-4 text-positive">
      <path d="m3 8.5 3.2 3L13 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Lets a visitor change region (and, in Nigeria, language) at any time - the first-visit popup only
 * shows once. `menu` is the desktop header dropdown; `inline` lays the options out as buttons for the
 * mobile menu, where a nested popover would be awkward.
 */
export function RegionSwitcher({ variant = "menu" }: { variant?: "menu" | "inline" }) {
  const { region, language } = useRegion();
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
      <div className="space-y-4">
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
              <Flag region={r.id} />
              {r.name}
            </button>
          ))}
        </div>
        {region === "ng" && (
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-ink-muted">Language</p>
            <div role="group" aria-label="Language" translate="no" className="flex flex-wrap gap-2">
              {languageList.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  aria-pressed={language === l.id}
                  onClick={() => setLanguage(l.id)}
                  className={`inline-flex min-h-11 items-center rounded-control border-2 px-4 font-semibold ${
                    language === l.id ? "border-link bg-link text-white" : "border-line text-ink hover:bg-surface"
                  }`}
                >
                  {l.native}
                </button>
              ))}
            </div>
          </div>
        )}
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
        className="flex min-h-11 items-center gap-2 rounded-control px-3 text-sm font-semibold text-ink hover:bg-surface"
      >
        <Flag region={region} />
        {regions[region].shortName}
      </button>
      {open && (
        <div id="region-menu" className="absolute right-0 top-full mt-2 w-56 rounded-card border border-line bg-card p-2 shadow-xl shadow-ink/10">
          <ul>
            {regionList.map((r) => (
              <li key={r.id}>
                <button
                  type="button"
                  aria-current={region === r.id ? "true" : undefined}
                  onClick={() => {
                    setRegion(r.id);
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-control px-3 py-2.5 text-left text-sm font-medium text-ink hover:bg-surface hover:text-link"
                >
                  <Flag region={r.id} />
                  <span className="flex-1">{r.name}</span>
                  {region === r.id && <Check />}
                </button>
              </li>
            ))}
          </ul>
          {region === "ng" && (
            <>
              <p className="mt-2 border-t border-line px-3 pb-1 pt-3 text-xs font-bold uppercase tracking-wider text-ink-muted">
                Language
              </p>
              <ul translate="no">
                {languageList.map((l) => (
                  <li key={l.id}>
                    <button
                      type="button"
                      aria-current={language === l.id ? "true" : undefined}
                      onClick={() => {
                        setLanguage(l.id);
                        setOpen(false);
                      }}
                      className="flex w-full items-center justify-between rounded-control px-3 py-2 text-left text-sm font-medium text-ink hover:bg-surface hover:text-link"
                    >
                      {l.native}
                      {language === l.id && <Check />}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}

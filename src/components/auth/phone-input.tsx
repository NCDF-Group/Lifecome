"use client";

import { useState, useRef, useEffect, useId } from "react";
import { Flag } from "@/components/ui/flag";
import type { Region } from "@/lib/region";
import { locateRegion } from "@/lib/locate";

interface Country {
  region: Region;
  dialCode: string;
  label: string;
}

const countries: Country[] = [
  { region: "ng", dialCode: "+234", label: "NG" },
  { region: "uk", dialCode: "+44", label: "UK" },
];

interface PhoneInputProps {
  phone: string;
  onPhoneChange: (phone: string) => void;
  dialCode: string;
  onDialCodeChange: (dialCode: string) => void;
  id?: string;
  autoDetectLocation?: boolean;
}

export function PhoneInput({
  phone,
  onPhoneChange,
  dialCode,
  onDialCodeChange,
  id,
  autoDetectLocation = true,
}: PhoneInputProps) {
  const [open, setOpen] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const autoId = useId();
  const inputId = id ?? autoId;
  const ref = useRef<HTMLDivElement>(null);

  const selected = countries.find((c) => c.dialCode === dialCode) ?? countries[0];

  /* Auto-detect location on mount for country code if enabled */
  useEffect(() => {
    if (!autoDetectLocation) return;
    let isMounted = true;

    async function detect() {
      try {
        const result = await locateRegion();
        if (isMounted && result.status === "found") {
          const matched = countries.find((c) => c.region === result.region);
          if (matched) {
            onDialCodeChange(matched.dialCode);
          }
        }
      } catch {
        // Fallback silently to default region (+234)
      }
    }

    detect();
    return () => {
      isMounted = false;
    };
  }, [autoDetectLocation, onDialCodeChange]);

  const handleManualDetect = async () => {
    setDetecting(true);
    try {
      const result = await locateRegion();
      if (result.status === "found") {
        const matched = countries.find((c) => c.region === result.region);
        if (matched) {
          onDialCodeChange(matched.dialCode);
        }
      }
    } finally {
      setDetecting(false);
    }
  };

  /* Close dropdown on outside click */
  useEffect(() => {
    if (!open) return;
    const handler = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, [open]);

  return (
    <div
      ref={ref}
      className="relative flex rounded-control border border-line bg-card"
    >
      {/* Country selector */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex shrink-0 items-center gap-1.5 rounded-l-control border-r border-line px-3 text-sm font-medium text-ink bg-surface/30 outline-none focus:outline-none focus:ring-0"
      >
        <Flag region={selected.region} className="h-3.5 w-5" />
        <span>
          {selected.label} {selected.dialCode}
        </span>
        <svg
          aria-hidden
          viewBox="0 0 12 12"
          className={`size-3 text-ink-muted transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path
            d="m2 4.5 4 4 4-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <ul className="absolute left-0 top-full z-20 mt-1 w-56 rounded-control border border-line bg-card py-1 shadow-xl shadow-ink/10">
          {countries.map((c) => (
            <li key={c.region}>
              <button
                type="button"
                onClick={() => {
                  onDialCodeChange(c.dialCode);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between px-3 py-2.5 text-sm font-medium outline-none focus:outline-none focus:ring-0 ${
                  c.dialCode === dialCode ? "bg-surface text-link" : "text-ink"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Flag region={c.region} className="h-3.5 w-5" />
                  <span>
                    {c.label} ({c.dialCode})
                  </span>
                </div>
                {c.dialCode === dialCode && (
                  <svg aria-hidden viewBox="0 0 16 16" className="size-4 text-link">
                    <path
                      d="M13.5 4.5L6.5 11.5L3 8"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            </li>
          ))}
          <li className="border-t border-line mt-1 pt-1 px-1">
            <button
              type="button"
              onClick={() => {
                handleManualDetect();
                setOpen(false);
              }}
              disabled={detecting}
              className="flex w-full items-center gap-2 rounded px-2 py-2 text-xs font-semibold text-link outline-none focus:outline-none focus:ring-0"
            >
              <svg aria-hidden viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {detecting ? "Detecting location..." : "Auto-detect country (Geo)"}
            </button>
          </li>
        </ul>
      )}

      {/* Phone number input */}
      <input
        id={inputId}
        type="tel"
        inputMode="numeric"
        value={phone}
        onChange={(e) => onPhoneChange(e.target.value.replace(/[^\d]/g, ""))}
        placeholder="Enter mobile number"
        className="min-w-0 flex-1 bg-transparent px-3 py-3 text-ink outline-none focus:outline-none focus:ring-0 placeholder:text-ink-muted"
      />
    </div>
  );
}

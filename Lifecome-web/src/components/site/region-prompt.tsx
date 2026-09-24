"use client";

import { useEffect, useRef, useState } from "react";
import { Flag } from "@/components/ui/flag";
import { locateRegion } from "@/lib/locate";
import { languageList, regionList, type Language, type Region } from "@/lib/region";
import { pauseScroll, resumeScroll } from "@/lib/smooth-scroll";
import { POPUP_SKIP_KEY, disablePopup, setPreferences, useRegion } from "@/lib/use-region";

const primary = "border-blue bg-blue text-white shadow-md shadow-blue/25 hover:bg-blue-strong";
const secondary = "border-line bg-card text-ink hover:border-link hover:bg-surface";

/** True when the page was reloaded by us (to apply a translation) rather than by the visitor. */
function reloadedByUs(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(POPUP_SKIP_KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * The region popup: are you in Nigeria or the UK? It shows on every page load until the visitor ticks
 * "Don't show this again". Nigeria continues to a language choice; the UK is English-only so it
 * finishes straight away. "Use my current location" answers for them if the browser allows it.
 */
export function RegionPrompt() {
  const { ready, popupDisabled } = useRegion();
  const [closed, setClosed] = useState(false);
  // Read once at mount (not consumed here, so React's double-invoked initialisers agree on it).
  const [skip] = useState(reloadedByUs);

  useEffect(() => {
    try {
      sessionStorage.removeItem(POPUP_SKIP_KEY);
    } catch {
      // Nothing to clear if storage is blocked.
    }
  }, []);

  if (!ready || popupDisabled || closed || skip) return null;
  return <RegionDialog onClose={() => setClosed(true)} />;
}

function RegionDialog({ onClose }: { onClose: () => void }) {
  const { detected, region, language, hasChosen } = useRegion();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  // A ref, not state: the location flow reads it after an await, when a captured value would be stale.
  const dontShowRef = useRef(false);
  const [step, setStep] = useState<"region" | "language">("region");
  const [locating, setLocating] = useState<"idle" | "asking" | "denied" | "unavailable" | "outside">("idle");

  // A native modal <dialog> gives us the focus trap, top-layer stacking and backdrop for free.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    // showModal() focuses the first button, which draws a focus ring around it before anyone has touched
    // anything. Park focus on the (ring-less) container instead; keyboard users still Tab to the buttons.
    contentRef.current?.focus({ preventScroll: true });
    pauseScroll();
    return resumeScroll;
  }, []);

  const finish = (chosen: Region, chosenLanguage: Language) => {
    setPreferences({ region: chosen, language: chosenLanguage, dontShowAgain: dontShowRef.current });
    onClose();
  };

  const choose = (chosen: Region) => {
    if (chosen === "ng") setStep("language");
    else finish(chosen, "en");
  };

  // Escape closes it for this visit without answering (and honours the checkbox).
  const dismiss = (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (dontShowRef.current) disablePopup();
    onClose();
  };

  // Once the visitor has allowed location and it matches a market, that *is* the answer: apply it and
  // close. (Nigeria keeps a language they'd already picked; otherwise English - the header menu changes it.)
  const useMyLocation = async () => {
    setLocating("asking");
    const result = await locateRegion();
    if (result.status === "found") {
      finish(result.region, result.region === "ng" && hasChosen && region === "ng" ? language : "en");
    } else {
      setLocating(result.status);
    }
  };

  const locationMessage =
    locating === "denied"
      ? "Location access is blocked. You can allow it in your browser's site settings, or just choose below."
      : locating === "unavailable"
        ? "We couldn't get your location. Please choose below."
        : locating === "outside"
          ? "Your location isn't in Nigeria or the UK. Please choose below."
          : "Only used on this device to pick your region. It isn't stored or sent anywhere.";

  // Highlight what they chose before, else what their network suggests; with neither, Nigeria.
  const lead = hasChosen ? region : (detected ?? "ng");

  return (
    <dialog
      ref={dialogRef}
      onCancel={dismiss}
      aria-labelledby="region-title"
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-card border border-line bg-card p-0 text-ink shadow-2xl shadow-ink/25 backdrop:bg-ink/60 backdrop:backdrop-blur-sm"
    >
      <div ref={contentRef} tabIndex={-1} className="p-6 outline-none sm:p-8">
        {step === "region" ? (
          <>
            <h2 id="region-title" className="text-xl font-bold text-ink">
              Are you in Nigeria or the UK?
            </h2>

            <div className="mt-5 flex flex-col items-center text-center">
              <button
                type="button"
                onClick={useMyLocation}
                disabled={locating === "asking"}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-control px-4 text-sm font-semibold text-link hover:bg-surface disabled:opacity-60"
              >
                <svg aria-hidden viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
                {locating === "asking" ? "Waiting for your permission…" : "Use my current location"}
              </button>
              <p role="status" className="mt-1 max-w-xs text-xs leading-relaxed text-ink-muted">
                {locationMessage}
              </p>
            </div>

            <div className="mt-4 grid gap-3">
              {regionList.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => choose(r.id)}
                  className={`flex min-h-14 items-center gap-3 rounded-control border-2 px-4 text-left text-base font-semibold transition duration-300 ease-smooth active:scale-[0.98] ${
                    r.id === lead ? primary : secondary
                  }`}
                >
                  <Flag region={r.id} className="h-5 w-8" />
                  {r.id === "ng" ? "I'm in Nigeria" : "I'm in the UK"}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setStep("region")}
              className="-ml-2 mb-3 inline-flex min-h-11 items-center gap-1.5 rounded-control px-2 text-sm font-semibold text-link hover:bg-surface"
            >
              <svg aria-hidden viewBox="0 0 16 16" className="size-4">
                <path d="M13 8H3m4-4L3 8l4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back
            </button>
            <h2 id="region-title" className="flex items-center gap-2.5 text-xl font-bold text-ink">
              <Flag region="ng" className="h-5 w-8" />
              Choose your language
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {languageList.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => finish("ng", l.id)}
                  translate="no"
                  className="flex min-h-16 flex-col items-start justify-center rounded-control border-2 border-line bg-card px-4 text-left transition duration-300 ease-smooth hover:border-link hover:bg-surface active:scale-[0.98]"
                >
                  <span className="text-base font-bold text-ink">{l.native}</span>
                  {l.native !== l.name && <span className="text-xs text-ink-muted">{l.name}</span>}
                </button>
              ))}
            </div>
            <p className="mt-5 text-xs leading-relaxed text-ink-muted">
              We&apos;ll remember your choice. Yoruba, Igbo and Hausa are translated automatically by Google Translate, so
              some wording may not be perfect. You can switch back to English from the menu at any time.
            </p>
          </>
        )}

        <label className="mt-6 flex min-h-11 cursor-pointer items-center gap-3 border-t border-line pt-4 text-sm text-ink-muted">
          <input
            type="checkbox"
            onChange={(event) => {
              dontShowRef.current = event.target.checked;
            }}
            className="size-4 shrink-0 accent-blue"
          />
          Don&apos;t show this again
        </label>
      </div>
    </dialog>
  );
}

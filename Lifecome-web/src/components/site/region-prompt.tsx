"use client";

import { useEffect, useRef, useState } from "react";
import { Flag } from "@/components/ui/flag";
import { locateRegion } from "@/lib/locate";
import { languageList, regionList, regions, type Language, type Region } from "@/lib/region";
import { pauseScroll, resumeScroll } from "@/lib/smooth-scroll";
import { setPreferences, useRegion } from "@/lib/use-region";

const primary = "border-blue bg-blue text-white shadow-md shadow-blue/25 hover:bg-blue-strong";
const secondary = "border-line bg-card text-ink hover:border-link hover:bg-surface";

/**
 * The first-visit popup: are you in Nigeria or the UK? Nigeria continues to a language choice;
 * the UK is English-only so it finishes straight away. Both answers are saved together, and the
 * popup never shows again once they are (see `useRegion().hasChosen`).
 */
export function RegionPrompt() {
  const { ready, hasChosen } = useRegion();
  if (!ready || hasChosen) return null;
  return <RegionDialog />;
}

function RegionDialog() {
  const { detected } = useRegion();
  const ref = useRef<HTMLDialogElement>(null);
  const [step, setStep] = useState<"region" | "language">("region");
  const [locating, setLocating] = useState<"idle" | "asking" | "denied" | "unavailable" | "outside">("idle");
  // What the browser's location says; leads over the network-based guess because it's more specific.
  const [located, setLocated] = useState<Region | null>(null);

  // A native modal <dialog> gives us the focus trap, top-layer stacking and backdrop for free.
  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
    pauseScroll();
    return resumeScroll;
  }, []);

  const choose = (region: Region) => {
    if (region === "ng") setStep("language");
    else setPreferences({ region, language: "en" });
  };

  const chooseLanguage = (language: Language) => setPreferences({ region: "ng", language });

  // Escape counts as an answer (their detected region, else Nigeria, in English) so it can't reappear.
  const dismiss = (event: React.SyntheticEvent) => {
    event.preventDefault();
    setPreferences({ region: detected ?? "ng", language: "en" });
  };

  // Lead with the browser location, else the network-based guess; with neither, Nigeria (the default).
  const lead = located ?? detected ?? "ng";

  // Suggests rather than decides: a coarse location check shouldn't answer for the visitor.
  const useMyLocation = async () => {
    setLocated(null);
    setLocating("asking");
    const result = await locateRegion();
    if (result.status === "found") {
      setLocated(result.region);
      setLocating("idle");
    } else {
      setLocating(result.status);
    }
  };

  const locationMessage =
    located !== null
      ? `Your location matches ${regions[located].country}. Confirm below.`
      : locating === "denied"
        ? "Location access is blocked. You can allow it in your browser's site settings, or just choose below."
        : locating === "unavailable"
          ? "We couldn't get your location. Please choose below."
          : locating === "outside"
            ? "Your location isn't in Nigeria or the UK. Please choose below."
            : null;

  return (
    <dialog
      ref={ref}
      onCancel={dismiss}
      aria-labelledby="region-title"
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-card border border-line bg-card p-0 text-ink shadow-2xl shadow-ink/25 backdrop:bg-ink/60 backdrop:backdrop-blur-sm"
    >
      <div className="p-6 sm:p-8">
        {step === "region" ? (
          <>
            <h2 id="region-title" className="text-xl font-bold text-ink">
              Are you in Nigeria or the UK?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              {detected && !located ? `It looks like you're in ${regions[detected].country}. ` : ""}
              LifeCome Live is available in both, and some features differ between the two.
            </p>
            <button
              type="button"
              onClick={useMyLocation}
              disabled={locating === "asking"}
              className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-control px-3 text-sm font-semibold text-link hover:bg-surface disabled:opacity-60"
            >
              <svg aria-hidden viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              {locating === "asking" ? "Waiting for your permission…" : "Use my current location"}
            </button>
            <p role="status" className="mt-1 min-h-5 px-3 text-xs leading-relaxed text-ink-muted">
              {locationMessage ?? "Only used on this device to suggest your region. It isn't stored or sent anywhere."}
            </p>
            <div className="mt-3 grid gap-3">
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
                  onClick={() => chooseLanguage(l.id)}
                  className="flex min-h-16 flex-col items-start justify-center rounded-control border-2 border-line bg-card px-4 text-left transition duration-300 ease-smooth hover:border-link hover:bg-surface active:scale-[0.98]"
                >
                  <span className="text-base font-bold text-ink">{l.native}</span>
                  {l.native !== l.name && <span className="text-xs text-ink-muted">{l.name}</span>}
                </button>
              ))}
            </div>
            <p className="mt-5 text-xs leading-relaxed text-ink-muted">
              We&apos;ll remember your choice. Yoruba, Igbo and Hausa translations are still being prepared, so the site
              shows in English until they&apos;re ready.
            </p>
          </>
        )}
      </div>
    </dialog>
  );
}

"use client";

import { regions, type Region } from "@/lib/region";
import { setRegion, useRegion } from "@/lib/use-region";

const primary = "bg-blue text-white shadow-md shadow-blue/25 hover:bg-blue-strong";
const secondary = "border-2 border-link bg-card text-link hover:bg-link hover:text-white";

/**
 * Asks first-time visitors which market they're using LifeCome Live in, leading with the one their
 * location points to. Disappears for good once they choose (or after they've used the header switcher).
 */
export function RegionPrompt() {
  const { ready, hasChosen, detected } = useRegion();
  if (!ready || hasChosen) return null;

  const options: { region: Region; label: string }[] = [
    { region: "ng", label: "Stay in Nigeria" },
    { region: "uk", label: "Go to UK" },
  ];
  // Lead with the detected region; with no detection, Nigeria (the default) leads.
  const lead = detected ?? "ng";

  return (
    <section
      aria-labelledby="region-prompt-title"
      className="fixed inset-x-4 bottom-4 z-50 rounded-card border border-line bg-card p-5 shadow-xl shadow-ink/15 sm:right-auto sm:max-w-md"
    >
      <h2 id="region-prompt-title" className="text-base font-bold text-ink">
        {detected ? `It looks like you're in ${regions[detected].country}` : "Where are you using LifeCome Live?"}
      </h2>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
        LifeCome Live is available in Nigeria and the United Kingdom, and some features differ between the two.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        {options.map(({ region, label }) => (
          <button
            key={region}
            type="button"
            onClick={() => setRegion(region)}
            className={`inline-flex min-h-11 items-center justify-center rounded-control px-5 text-[0.95rem] font-semibold transition duration-300 ease-smooth active:scale-[0.97] ${
              region === lead ? primary : secondary
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </section>
  );
}

import type { ReactNode } from "react";

/**
 * Renders copy that differs between Nigeria and the UK. Both are in the static HTML and CSS shows
 * the visitor's (see the `data-region-only` rules in globals.css), so it works in server components
 * and never flashes the wrong market's wording.
 */
export function ForRegion({ ng, uk }: { ng: ReactNode; uk: ReactNode }) {
  return (
    <>
      <span data-region-only="ng">{ng}</span>
      <span data-region-only="uk">{uk}</span>
    </>
  );
}

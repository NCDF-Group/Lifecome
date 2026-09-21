"use client";

import { useState } from "react";

interface Faq {
  q: string;
  a: string;
}

/** FAQ accordion (native <details>) with an optional live search box. */
export function FaqList({ items, searchable = false }: { items: Faq[]; searchable?: boolean }) {
  const [query, setQuery] = useState("");
  const needle = query.trim().toLowerCase();
  const shown = needle ? items.filter((f) => `${f.q} ${f.a}`.toLowerCase().includes(needle)) : items;

  return (
    <div>
      {searchable && (
        <div className="mb-6">
          <label htmlFor="faq-search" className="sr-only">
            Search help articles
          </label>
          <input
            id="faq-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search help articles"
            className="min-h-12 w-full rounded-control border-2 border-line bg-card px-4 text-base text-ink placeholder:text-ink-muted focus:border-link focus:outline-none"
          />
          <p aria-live="polite" className="mt-2 text-sm text-ink-muted">
            {needle ? `${shown.length} result${shown.length === 1 ? "" : "s"}` : `${items.length} articles`}
          </p>
        </div>
      )}
      {shown.length === 0 ? (
        <p className="rounded-card border border-line bg-card p-5 text-ink-muted">
          No matching articles. Try different words, or contact support from the link below.
        </p>
      ) : (
        <ul className="divide-y divide-line overflow-hidden rounded-card border border-line bg-card">
          {shown.map((f) => (
            <li key={f.q}>
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold hover:bg-surface [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <svg aria-hidden viewBox="0 0 12 12" className="size-3 shrink-0 text-link transition-transform duration-300 group-open:rotate-180">
                    <path d="m2 4.5 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </summary>
                <p className="px-5 pb-5 leading-relaxed text-ink-muted">{f.a}</p>
              </details>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

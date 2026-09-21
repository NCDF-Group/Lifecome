import Link from "next/link";

/** Placeholder wordmark until the official logo artwork is supplied. */
export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="LifeCome Live home">
      <svg aria-hidden viewBox="0 0 32 32" className="size-8">
        <circle cx="16" cy="16" r="16" fill="var(--brand-blue)" />
        <path d="M16 24s-7-4.6-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 23 14c0 5.4-7 10-7 10Z" fill="var(--brand-lime)" />
      </svg>
      <span className="text-lg font-extrabold tracking-tight text-ink">
        LifeCome <span className="text-blue">Live</span>
      </span>
    </Link>
  );
}

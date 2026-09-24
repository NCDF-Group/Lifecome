/**
 * "Coming soon" store badges. Not links — the apps do not exist yet, so these are informational
 * only (no href, no hover affordance) rather than a control that promises a destination.
 */

function AppleMark() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-6 shrink-0 sm:size-7" fill="currentColor">
      <path d="M16.365 1.43c0 1.14-.42 2.06-1.26 2.98-.9.98-2.02 1.55-3.16 1.46-.11-1.1.42-2.24 1.24-3.09.9-.95 2.36-1.62 3.18-1.35zM20.6 17.14c-.5 1.17-.73 1.68-1.36 2.7-.88 1.44-2.12 3.23-3.66 3.24-1.36.02-1.71-.89-3.55-.87-1.84.01-2.23.9-3.6.87-1.53-.03-2.71-1.65-3.6-3.09C2.34 16.78 1.7 13.06 3 10.4c.83-1.7 2.31-2.78 3.93-2.8 1.44-.02 2.79.97 3.66.97.86 0 2.51-1.2 4.23-1.02.72.03 2.75.29 4.05 2.19-.1.07-2.42 1.41-2.39 4.21.02 3.34 2.93 4.45 3.12 4.19z" />
    </svg>
  );
}

function GooglePlayMark() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-6 shrink-0 sm:size-7">
      <g transform="translate(2.5 3)">
        <path d="M0 0 8.6 4.5 4 9 0 18Z" fill="#12B7F0" />
        <path d="M0 0 8.6 4.5 12.4 6.5 4 9Z" fill="#3BC760" />
        <path d="M4 9 12.4 11.5 8.6 13.5 0 18Z" fill="#FFCE00" />
        <path d="M4 9 12.4 6.5 17.6 9 12.4 11.5Z" fill="#FF3D57" />
      </g>
    </svg>
  );
}

function Badge({ mark, kicker, name }: { mark: React.ReactNode; kicker: string; name: string }) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-2.5 rounded-control border border-line bg-white px-3 py-2.5 text-[#0b2540] shadow-sm sm:min-w-[13rem] sm:flex-none sm:gap-3 sm:px-4">
      {mark}
      <span className="min-w-0 text-left leading-tight">
        <span className="block whitespace-nowrap text-[0.6rem] uppercase tracking-wide text-[#435a70] sm:text-[0.65rem]">{kicker}</span>
        <span className="block whitespace-nowrap text-[0.95rem] font-bold sm:text-base">{name}</span>
      </span>
    </div>
  );
}

export function AppStoreBadge() {
  return <Badge mark={<AppleMark />} kicker="Coming soon" name="App Store" />;
}

export function GooglePlayBadge() {
  return <Badge mark={<GooglePlayMark />} kicker="Coming soon" name="Google Play" />;
}

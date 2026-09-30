const tones = {
  covered: "bg-green/15 text-positive",
  authorisation: "bg-gold/20 text-[#6b4f12] dark:text-[#e3c07a]",
  approved: "bg-blue/10 text-link",
  neutral: "bg-surface text-ink-muted",
} as const;

/** Status chip: always carries a text label, never colour alone (blueprint §4.2, §19). */
export function StatusChip({ tone, children }: { tone: keyof typeof tones; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}>
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}

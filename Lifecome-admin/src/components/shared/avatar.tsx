import { cn } from "@/lib/utils";

/** A circular initials avatar for a patient, provider or staff member.
 * No real photo library exists yet, so initials-on-a-tinted-circle is the
 * honest choice here rather than reusing a stock photo as if it were a
 * specific person's picture - the same approach Lifecome-mobile's own
 * `Avatar` widget takes. */
export function Avatar({
  name,
  size = 40,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const initials = getInitials(name);

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-blue/10 font-bold text-blue-strong",
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials}
    </div>
  );
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return (parts[0].slice(0, 1) + parts[parts.length - 1].slice(0, 1)).toUpperCase();
}

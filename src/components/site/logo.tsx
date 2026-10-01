import Image from "next/image";
import Link from "next/link";

/** Full-colour logo in light mode, pure-white logo in dark mode. SVGs are served as-is from /public/brand. */
export function Logo({ className = "h-7 sm:h-9" }: { className?: string }) {
  return (
    <Link href="/" aria-label="LifeCome Live home" className="inline-flex shrink-0 items-center">
      <Image
        src="/brand/lifecome-live-logo.svg"
        alt="LifeCome Live"
        width={916}
        height={164}
        unoptimized
        className={`w-auto dark:hidden ${className}`}
      />
      <Image
        src="/brand/lifecome-live-logo-white.svg"
        alt="LifeCome Live"
        width={916}
        height={164}
        unoptimized
        className={`hidden w-auto dark:block ${className}`}
      />
    </Link>
  );
}

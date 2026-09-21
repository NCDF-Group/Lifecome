import Link from "next/link";
import type { ComponentProps } from "react";

const variants = {
  primary: "bg-blue text-white shadow-md shadow-blue/25 hover:bg-blue-strong hover:shadow-lg hover:shadow-blue/35",
  secondary: "border-2 border-link bg-card text-link hover:bg-link hover:text-white hover:shadow-lg hover:shadow-blue/20",
  accent: "bg-lime text-[#0b2540] shadow-md shadow-black/10 hover:shadow-lg hover:shadow-black/20",
  ghost: "text-link hover:bg-surface",
} as const;

/** Light sweep across filled buttons on hover. */
const sheen =
  "before:pointer-events-none before:absolute before:inset-0 before:-translate-x-full before:bg-linear-to-r before:from-transparent before:via-white/30 before:to-transparent before:transition-transform before:duration-700 hover:before:translate-x-full";

const sheens = { primary: sheen, accent: sheen, secondary: "", ghost: "" } as const;

const sizes = {
  md: "min-h-11 px-5 text-[0.95rem]",
  lg: "min-h-12 px-7 text-base",
} as const;

interface ButtonLinkProps extends ComponentProps<typeof Link> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  /** Show an arrow that nudges right on hover. */
  arrow?: boolean;
}

export function ButtonLink({ variant = "primary", size = "md", arrow = false, className = "", children, ...props }: ButtonLinkProps) {
  return (
    <Link
      {...props}
      className={`group relative inline-flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-control font-semibold transition duration-300 ease-smooth hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] ${variants[variant]} ${sheens[variant]} ${sizes[size]} ${className}`}
    >
      {children}
      {arrow && (
        <svg aria-hidden viewBox="0 0 16 16" className="size-4 transition-transform duration-300 ease-smooth group-hover:translate-x-1">
          <path d="M3 8h10m-4-4 4 4-4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </Link>
  );
}

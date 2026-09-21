import Link from "next/link";
import type { ComponentProps } from "react";

const variants = {
  primary: "bg-blue text-white hover:bg-blue-strong",
  secondary: "border-2 border-blue bg-white text-blue hover:bg-surface",
  accent: "bg-lime text-ink hover:brightness-95",
  ghost: "text-blue hover:bg-surface",
} as const;

const sizes = {
  md: "min-h-11 px-5 text-[0.95rem]",
  lg: "min-h-12 px-7 text-base",
} as const;

interface ButtonLinkProps extends ComponentProps<typeof Link> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
}

export function ButtonLink({ variant = "primary", size = "md", className = "", ...props }: ButtonLinkProps) {
  return (
    <Link
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-control font-semibold transition-colors ${variants[variant]} ${sizes[size]} ${className}`}
    />
  );
}

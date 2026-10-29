import React from "react"
import Link from "next/link"
import Image from "next/image"

interface BrandLogoProps {
  variant?: "health" | "live"
  href?: string
  className?: string
  size?: "sm" | "md" | "lg"
}

export function BrandLogo({
  variant = "health",
  href,
  className = "",
  size = "md",
}: BrandLogoProps) {
  const sizeClasses = {
    sm: "w-[115px] h-[38px]",
    md: "w-[145px] h-[48px]",
    lg: "w-[175px] h-[58px]",
  }

  const content = (
    <div className={`relative ${sizeClasses[size]} select-none shrink-0 ${className}`}>
      <Image
        src="/brand/lifecomeH.png"
        alt="LifeCome Health"
        fill
        sizes="(max-width: 768px) 120px, 160px"
        className="object-contain object-left"
        priority
      />
    </div>
  )

  return withLink(content, href)
}

function withLink(content: React.ReactNode, href?: string) {
  if (href) {
    return (
      <Link href={href} className="inline-flex items-center transition-opacity hover:opacity-90">
        {content}
      </Link>
    )
  }

  return content
}

/**
 * Just the clover mark, for tight spaces like the collapsed sidebar. There is no separate
 * icon asset, so this crops the wordmark (865×288) to the clover at its left edge.
 */
export function BrandMark({ href, className = "" }: { href?: string; className?: string }) {
  const content = (
    <div className={`relative w-[31px] h-9 overflow-hidden select-none shrink-0 ${className}`}>
      <Image
        src="/brand/lifecomeH.png"
        alt="LifeCome Health"
        width={160}
        height={53}
        className="absolute max-w-none left-[-3px] top-[-8px] w-[160px] h-[53px]"
        priority
      />
    </div>
  )
  return withLink(content, href)
}

"use client"

import React, { useEffect, useRef } from "react"
import { Mic, VideoOff } from "lucide-react"
import { Avatar, FOCUS_RING } from "@/components/portal/ui"
import type { useLocalMedia } from "@/hooks/useLocalMedia"
import { cn } from "@/lib/utils"

export const CALL_CONTROL = cn("flex flex-col items-center gap-1.5 rounded-xl text-sm text-slate-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed", FOCUS_RING)
export const CALL_CONTROL_ICON = "w-12 h-12 rounded-full flex items-center justify-center transition-colors"

/** The patient's own camera, shown in the corner of a call. */
export function SelfView({ media }: { media: ReturnType<typeof useLocalMedia> }) {
  const previewRef = useRef<HTMLVideoElement>(null)
  const showPreview = Boolean(media.stream) && !media.isCameraOff

  useEffect(() => {
    if (previewRef.current) previewRef.current.srcObject = media.stream
  }, [media.stream])

  return (
    <div className="absolute top-3 right-3 w-20 sm:w-28 aspect-[4/5] rounded-xl overflow-hidden bg-slate-600 ring-1 ring-white/30">
      <video ref={previewRef} autoPlay muted playsInline aria-label="Your camera preview" className={cn("w-full h-full object-cover -scale-x-100", !showPreview && "hidden")} />
      {!showPreview && (
        <span className="absolute inset-0 flex items-center justify-center text-slate-200">
          <VideoOff className="w-5 h-5" aria-hidden />
          <span className="sr-only">Your camera is off</span>
        </span>
      )}
      <span className="absolute left-1.5 bottom-1.5 rounded bg-slate-900/80 px-1.5 py-0.5 text-xs font-semibold">You</span>
    </div>
  )
}

/** The dark call area, with the patient's own camera in the corner. */
export function CallStage({
  media,
  name,
  title,
  footer,
  children,
}: {
  media: ReturnType<typeof useLocalMedia>
  name: string
  title: string
  footer?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-[400px] sm:min-h-0 sm:aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-slate-700 to-slate-900 text-white shadow-md flex items-center justify-center p-6 pb-20 text-center">
      <div className="max-w-sm">
        <Avatar name={name} tone="blue" className="w-16 h-16 sm:w-20 sm:h-20 text-xl mx-auto" />
        <h2 className="mt-4 text-lg sm:text-xl font-bold">{title}</h2>
        <div className="mt-1 space-y-1 text-sm sm:text-[15px] text-slate-200">{children}</div>
      </div>

      <SelfView media={media} />

      {footer && <div className="absolute left-3 bottom-3 rounded-lg bg-slate-800/90 px-3.5 py-2 text-left">{footer}</div>}
    </div>
  )
}

export function CallControl({
  label,
  icon: Icon,
  pressed,
  disabled,
  onClick,
}: {
  label: string
  icon: typeof Mic
  pressed: boolean
  disabled: boolean
  onClick: () => void
}) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} aria-pressed={pressed} className={CALL_CONTROL}>
      <span aria-hidden className={cn(CALL_CONTROL_ICON, "text-white", pressed ? "bg-slate-500" : "bg-slate-700 hover:bg-slate-800")}>
        <Icon className="w-5 h-5" />
      </span>
      {label}
    </button>
  )
}

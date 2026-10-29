"use client"

import { useEffect, type RefObject } from "react"

/** Closes a popover when the user clicks outside it or presses Escape. */
export function useDismiss(ref: RefObject<HTMLElement | null>, isOpen: boolean, onClose: () => void) {
  useEffect(() => {
    if (!isOpen) return

    const handlePointer = (event: PointerEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) onClose()
    }
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }

    document.addEventListener("pointerdown", handlePointer)
    document.addEventListener("keydown", handleKey)
    return () => {
      document.removeEventListener("pointerdown", handlePointer)
      document.removeEventListener("keydown", handleKey)
    }
  }, [ref, isOpen, onClose])
}

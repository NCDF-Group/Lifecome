"use client"

import { Info } from "lucide-react"
import { Notice } from "@/components/portal/messages/shared"

/** Shown on every screen of the sample booking, so it can't be mistaken for a real one. */
export function SampleSessionNotice() {
  return (
    <Notice icon={Info} title="Sample booking">
      This is a preview. Nothing has been booked and no payment has been taken.
    </Notice>
  )
}

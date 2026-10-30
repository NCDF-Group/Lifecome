import { Suspense } from "react"
import type { Metadata } from "next"
import { OnlineGpBooking } from "@/components/portal/booking/OnlineGpBooking"
import { LoadingCards } from "@/components/portal/ui"

export const metadata: Metadata = { title: "Book an online GP | LifeCome Health" }

export default function OnlineGpBookingPage() {
  return (
    <Suspense fallback={<LoadingCards count={3} label="Loading your booking" />}>
      <OnlineGpBooking />
    </Suspense>
  )
}

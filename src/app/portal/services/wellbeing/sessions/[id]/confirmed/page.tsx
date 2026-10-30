import type { Metadata } from "next"
import { BookingConfirmed } from "@/components/portal/services/wellbeing/BookingConfirmed"

export const metadata: Metadata = { title: "Wellbeing booking confirmed | LifeCome Health" }

export default async function BookingConfirmedPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <BookingConfirmed id={id} />
}

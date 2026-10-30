import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ReviewBooking } from "@/components/portal/services/wellbeing/ReviewBooking"
import { isWellbeingService } from "@/lib/wellbeing"

export const metadata: Metadata = { title: "Review wellbeing booking | LifeCome Health" }

export default async function ReviewBookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ service: string }>
  searchParams: Promise<{ date?: string; time?: string }>
}) {
  const [{ service }, { date, time }] = await Promise.all([params, searchParams])
  if (!isWellbeingService(service)) notFound()
  return <ReviewBooking serviceId={service} date={date} time={time} />
}

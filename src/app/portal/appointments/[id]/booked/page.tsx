import type { Metadata } from "next"
import { AppointmentBooked } from "@/components/portal/appointments/AppointmentBooked"

export const metadata: Metadata = { title: "You're booked in | LifeCome Health" }

export default async function AppointmentBookedPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <AppointmentBooked id={id} />
}

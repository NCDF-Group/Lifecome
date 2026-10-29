import type { Metadata } from "next"
import { RescheduleAppointment } from "@/components/portal/appointments/RescheduleAppointment"

export const metadata: Metadata = { title: "Reschedule appointment | LifeCome Health" }

export default async function RescheduleAppointmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <RescheduleAppointment id={id} />
}

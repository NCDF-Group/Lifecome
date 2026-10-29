import type { Metadata } from "next"
import { AppointmentCancelled } from "@/components/portal/appointments/AppointmentCancelled"

export const metadata: Metadata = { title: "Appointment cancelled | LifeCome Health" }

export default async function AppointmentCancelledPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <AppointmentCancelled id={id} />
}

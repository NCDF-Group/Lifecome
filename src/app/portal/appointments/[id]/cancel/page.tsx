import type { Metadata } from "next"
import { CancelAppointment } from "@/components/portal/appointments/CancelAppointment"

export const metadata: Metadata = { title: "Cancel your appointment | LifeCome Health" }

export default async function CancelAppointmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <CancelAppointment id={id} />
}

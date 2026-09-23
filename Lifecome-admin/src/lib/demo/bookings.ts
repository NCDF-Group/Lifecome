/**
 * Demo bookings standing in for `GET /api/v1/bookings` (Lifecome-backend's
 * `booking` module). Shapes match Lifecome-mobile's `Appointment`/
 * `BookingStatus` models so the same data would look identical on both
 * clients once this reads from the real API.
 */
export type BookingStatus =
  | "pending_payment"
  | "confirmed"
  | "completed"
  | "cancelled";

export type DemoBooking = {
  id: string;
  patientName: string;
  doctorName: string;
  service: string;
  scheduledAt: string;
  status: BookingStatus;
  fee: number;
};

export const demoBookings: DemoBooking[] = [
  {
    id: "bkg-001",
    patientName: "Ngozi Adeyemi",
    doctorName: "Dr. Adaeze Okonkwo",
    service: "General consultation",
    scheduledAt: "2026-09-24T09:00:00+01:00",
    status: "confirmed",
    fee: 8000,
  },
  {
    id: "bkg-002",
    patientName: "Ada Okonkwo",
    doctorName: "Dr. Ifeoma Chukwu",
    service: "Follow-up visit",
    scheduledAt: "2026-09-24T10:30:00+01:00",
    status: "pending_payment",
    fee: 5000,
  },
  {
    id: "bkg-003",
    patientName: "Emeka Nwosu",
    doctorName: "Dr. Tunde Bakare",
    service: "Specialist consultation",
    scheduledAt: "2026-09-23T14:00:00+01:00",
    status: "completed",
    fee: 15000,
  },
  {
    id: "bkg-004",
    patientName: "Chika Eze",
    doctorName: "Dr. Blessing Udo",
    service: "General consultation",
    scheduledAt: "2026-09-22T11:00:00+01:00",
    status: "cancelled",
    fee: 7000,
  },
];

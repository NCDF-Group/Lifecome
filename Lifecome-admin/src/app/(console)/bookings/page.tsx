import { CalendarDays } from "lucide-react";
import { demoBookings } from "@/lib/demo/bookings";
import { BookingsTable } from "@/features/bookings/components/bookings-table";
import { PageHeader } from "@/components/shared/page-header";

export default function BookingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader icon={CalendarDays} title="Bookings" />
      <BookingsTable bookings={demoBookings} />
    </div>
  );
}

// Mirrors Lifecome-backend's `DashboardSummary` (src/modules/admin-dashboard/admin-dashboard.service.ts).
export interface DashboardSummary {
  totals: {
    patients: number;
    activeProviders: number;
    bookings: number;
    successfulPayments: { count: number; amountKobo: number };
  };
  bookingsByStatus: Record<string, number>;
  paymentsByStatus: Record<string, number>;
  bookingsTrend: { date: string; count: number }[];
}

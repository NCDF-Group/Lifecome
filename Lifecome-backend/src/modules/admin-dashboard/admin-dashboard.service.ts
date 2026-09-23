import { Inject, Injectable } from '@nestjs/common';
import { count, eq, gte, sql } from 'drizzle-orm';

import { DRIZZLE, type Database } from '../../db/client';
import { appointments, patients, paymentTransactions, providers } from '../../db/schema';

const TREND_DAYS = 14;

export interface BookingsTrendPoint {
  date: string;
  count: number;
}

export interface DashboardSummary {
  totals: {
    patients: number;
    activeProviders: number;
    bookings: number;
    successfulPayments: { count: number; amountKobo: number };
  };
  bookingsByStatus: Record<string, number>;
  paymentsByStatus: Record<string, number>;
  bookingsTrend: BookingsTrendPoint[];
}

/** Backs `/admin/dashboard` — the operations console's landing page. Every number here is a live
 * cross-table aggregate, not a per-module list, which is why it lives in its own module rather
 * than any one domain module. */
@Injectable()
export class AdminDashboardService {
  constructor(@Inject(DRIZZLE) private readonly db: Database) {}

  async getSummary(): Promise<DashboardSummary> {
    const [
      [{ patientCount }],
      [{ activeProviderCount }],
      [{ bookingCount }],
      [{ successfulCount, successfulAmountKobo }],
      bookingsByStatusRows,
      paymentsByStatusRows,
      bookingsTrend,
    ] = await Promise.all([
      this.db.select({ patientCount: count() }).from(patients),
      this.db.select({ activeProviderCount: count() }).from(providers).where(eq(providers.networkStatus, 'active')),
      this.db.select({ bookingCount: count() }).from(appointments),
      this.db
        .select({
          successfulCount: count(),
          successfulAmountKobo: sql<number>`coalesce(sum(${paymentTransactions.amountKobo}), 0)::int`,
        })
        .from(paymentTransactions)
        .where(eq(paymentTransactions.status, 'successful')),
      this.db.select({ status: appointments.status, total: count() }).from(appointments).groupBy(appointments.status),
      this.db
        .select({ status: paymentTransactions.status, total: count() })
        .from(paymentTransactions)
        .groupBy(paymentTransactions.status),
      this.getBookingsTrend(),
    ]);

    return {
      totals: {
        patients: patientCount,
        activeProviders: activeProviderCount,
        bookings: bookingCount,
        successfulPayments: { count: successfulCount, amountKobo: successfulAmountKobo },
      },
      bookingsByStatus: Object.fromEntries(bookingsByStatusRows.map((row) => [row.status, row.total])),
      paymentsByStatus: Object.fromEntries(paymentsByStatusRows.map((row) => [row.status, row.total])),
      bookingsTrend,
    };
  }

  private async getBookingsTrend(): Promise<BookingsTrendPoint[]> {
    const since = new Date(Date.now() - TREND_DAYS * 24 * 60 * 60 * 1000);
    const day = sql`date_trunc('day', ${appointments.createdAt})`;

    const rows = await this.db
      .select({ date: sql<string>`to_char(${day}, 'YYYY-MM-DD')`, total: count() })
      .from(appointments)
      .where(gte(appointments.createdAt, since))
      .groupBy(day)
      .orderBy(day);

    return rows.map((row) => ({ date: row.date, count: row.total }));
  }
}

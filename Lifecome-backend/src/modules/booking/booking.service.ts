import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';

import { DRIZZLE, type Database } from '../../db/client';
import { appointments } from '../../db/schema';
import { AppException, NotFoundAppException } from '../../common/errors/app-exception';
import { SchedulingService } from '../scheduling/scheduling.service';
import type { CreateAppointmentDto } from './dto/booking.dto';

export type Appointment = typeof appointments.$inferSelect;

const CANCELLABLE_STATUSES: Appointment['status'][] = ['slot_held', 'confirmed'];

/**
 * The appointment lifecycle (blueprint §4.1): `slot_held` → `confirmed`, or → `cancelled` /
 * `doctor_unavailable` / `patient_no_show`. Confirmation is a separate step from creation —
 * booking.service.ts does not decide *when* to confirm; payment.service.ts and
 * authorisation.service.ts call `confirm()` once their own state machine reaches a paid /
 * approved state (blueprint §3.2 — payer convergence rule).
 */
@Injectable()
export class BookingService {
  constructor(
    @Inject(DRIZZLE) private readonly db: Database,
    private readonly scheduling: SchedulingService,
  ) {}

  /** View 15 — Review Booking & Payment (the appointment is created in `slot_held` state here). */
  async create(input: CreateAppointmentDto): Promise<Appointment> {
    // Re-asserts the hold; throws SLOT_UNAVAILABLE if it has expired or was taken meanwhile.
    await this.scheduling.holdSlot(input.availabilitySlotId);

    const [appointment] = await this.db
      .insert(appointments)
      .values({ ...input, status: 'slot_held' })
      .returning();

    return appointment;
  }

  async getById(id: string): Promise<Appointment> {
    const [appointment] = await this.db.select().from(appointments).where(eq(appointments.id, id));
    if (!appointment) throw new NotFoundAppException('Appointment');
    return appointment;
  }

  /** View 17 — Booking Confirmation. Called once payment succeeds or HMO authorisation is approved. */
  async confirm(id: string, authorisationId?: string): Promise<Appointment> {
    const appointment = await this.getById(id);
    if (appointment.status !== 'slot_held') {
      throw new AppException('BOOKING_NOT_HOLDABLE', `This booking cannot be confirmed from its current state (${appointment.status}).`, 409);
    }

    await this.scheduling.markBooked(appointment.availabilitySlotId);

    const [updated] = await this.db
      .update(appointments)
      .set({ status: 'confirmed', authorisationId, updatedAt: new Date() })
      .where(eq(appointments.id, id))
      .returning();

    return updated;
  }

  async cancel(id: string): Promise<Appointment> {
    const appointment = await this.getById(id);
    if (!CANCELLABLE_STATUSES.includes(appointment.status)) {
      throw new AppException('BOOKING_NOT_CANCELLABLE', `This booking cannot be cancelled from its current state (${appointment.status}).`, 409);
    }

    await this.scheduling.release(appointment.availabilitySlotId);

    const [updated] = await this.db
      .update(appointments)
      .set({ status: 'cancelled', updatedAt: new Date() })
      .where(eq(appointments.id, id))
      .returning();

    return updated;
  }
}

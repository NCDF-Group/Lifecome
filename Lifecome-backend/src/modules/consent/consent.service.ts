import { Inject, Injectable } from '@nestjs/common';
import { and, eq, isNull } from 'drizzle-orm';

import { DRIZZLE, type Database } from '../../db/client';
import { consentRecords } from '../../db/schema';
import { NotFoundAppException } from '../../common/errors/app-exception';
import type { GrantConsentDto } from './dto/consent.dto';

export type ConsentRecord = typeof consentRecords.$inferSelect;

/** Versioned consent (blueprint §7 — "Consent": purpose/version/timestamp/channel, never overwritten). */
@Injectable()
export class ConsentService {
  constructor(@Inject(DRIZZLE) private readonly db: Database) {}

  async grant(input: GrantConsentDto): Promise<ConsentRecord> {
    const [record] = await this.db.insert(consentRecords).values(input).returning();
    return record;
  }

  async revoke(id: string): Promise<ConsentRecord> {
    const [updated] = await this.db
      .update(consentRecords)
      .set({ revokedAt: new Date() })
      .where(eq(consentRecords.id, id))
      .returning();
    if (!updated) throw new NotFoundAppException('Consent record');
    return updated;
  }

  list(patientId: string): Promise<ConsentRecord[]> {
    return this.db.select().from(consentRecords).where(eq(consentRecords.patientId, patientId));
  }

  async hasActiveConsent(patientId: string, consentType: ConsentRecord['consentType']): Promise<boolean> {
    const [record] = await this.db
      .select({ id: consentRecords.id })
      .from(consentRecords)
      .where(
        and(eq(consentRecords.patientId, patientId), eq(consentRecords.consentType, consentType), isNull(consentRecords.revokedAt)),
      )
      .limit(1);
    return Boolean(record);
  }
}

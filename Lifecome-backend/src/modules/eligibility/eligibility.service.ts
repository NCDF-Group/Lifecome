import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';

import { DRIZZLE, type Database } from '../../db/client';
import { clinicalServices, eligibilityChecks, memberships, payers } from '../../db/schema';
import { NotFoundAppException } from '../../common/errors/app-exception';
import { AuditService } from '../audit/audit.service';
import { PayerAdapterRegistry } from '../payer/adapters/payer-adapter.registry';

export type EligibilityCheck = typeof eligibilityChecks.$inferSelect;

/**
 * Service-level eligibility (view 09 — Check Service Eligibility). Kept as its own module,
 * separate from `PayerModule`'s membership verification, because it is a distinct decision with
 * its own state machine (blueprint §4.1, §7) even though both go through the same payer adapter.
 */
@Injectable()
export class EligibilityService {
  constructor(
    @Inject(DRIZZLE) private readonly db: Database,
    private readonly registry: PayerAdapterRegistry,
    private readonly audit: AuditService,
  ) {}

  async check(membershipId: string, clinicalServiceCode: string): Promise<EligibilityCheck> {
    const [membership] = await this.db.select().from(memberships).where(eq(memberships.id, membershipId));
    if (!membership) throw new NotFoundAppException('Membership');

    const [payer] = await this.db.select().from(payers).where(eq(payers.id, membership.payerId));
    const [service] = await this.db.select().from(clinicalServices).where(eq(clinicalServices.code, clinicalServiceCode));
    if (!service) throw new NotFoundAppException('Clinical service');

    const adapter = this.registry.get(payer.code);
    const result = await adapter.checkEligibility({
      payerCode: payer.code,
      memberId: membership.memberId,
      planId: membership.planId ?? undefined,
      clinicalServiceCode,
      date: new Date().toISOString().slice(0, 10),
    });

    await this.audit.record({
      actorType: 'patient',
      actorId: membership.patientId,
      action: 'payer_decision',
      resourceType: 'eligibility_check',
      resourceId: membershipId,
      metadata: { clinicalServiceCode, status: result.status },
    });

    const [check] = await this.db
      .insert(eligibilityChecks)
      .values({
        membershipId,
        clinicalServiceId: service.id,
        status: result.status,
        coPayKobo: result.coPayKobo?.toString(),
        rawResponse: result.raw ?? {},
      })
      .returning();

    return check;
  }
}

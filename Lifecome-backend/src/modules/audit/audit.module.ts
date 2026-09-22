import { Module } from '@nestjs/common';

import { AuditService } from './audit.service';

/**
 * No controller: the audit log is written by other modules (via `AuditService.record`), never
 * directly by a client. Reading it back is an operations-console concern, added when that portal
 * is built.
 */
@Module({
  providers: [AuditService],
  exports: [AuditService],
})
export class AuditModule {}

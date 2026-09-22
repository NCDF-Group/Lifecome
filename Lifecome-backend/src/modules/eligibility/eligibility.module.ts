import { Module } from '@nestjs/common';

import { AuditModule } from '../audit/audit.module';
import { PayerModule } from '../payer/payer.module';
import { EligibilityController } from './eligibility.controller';
import { EligibilityService } from './eligibility.service';

@Module({
  imports: [PayerModule, AuditModule],
  controllers: [EligibilityController],
  providers: [EligibilityService],
  exports: [EligibilityService],
})
export class EligibilityModule {}

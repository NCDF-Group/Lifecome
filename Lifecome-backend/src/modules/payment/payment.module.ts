import { Module } from '@nestjs/common';

import { AuditModule } from '../audit/audit.module';
import { BookingModule } from '../booking/booking.module';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

@Module({
  imports: [BookingModule, AuditModule],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}

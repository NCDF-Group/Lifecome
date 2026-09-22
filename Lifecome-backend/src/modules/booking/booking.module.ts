import { Module } from '@nestjs/common';

import { SchedulingModule } from '../scheduling/scheduling.module';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';

@Module({
  imports: [SchedulingModule],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}

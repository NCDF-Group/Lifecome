import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import type { Queue } from 'bullmq';

import { QUEUE_NAMES } from '../../queue/queue.module';
import type { EnqueueNotificationDto } from './dto/notifications.dto';

const RETRY_ATTEMPTS = 5;

@Injectable()
export class NotificationsService {
  constructor(@InjectQueue(QUEUE_NAMES.NOTIFICATIONS) private readonly queue: Queue) {}

  async enqueue(input: EnqueueNotificationDto): Promise<{ jobId: string }> {
    const job = await this.queue.add('send', input, {
      attempts: RETRY_ATTEMPTS,
      backoff: { type: 'exponential', delay: 5_000 },
      removeOnComplete: 1_000,
      removeOnFail: 5_000,
    });
    return { jobId: job.id ?? '' };
  }
}

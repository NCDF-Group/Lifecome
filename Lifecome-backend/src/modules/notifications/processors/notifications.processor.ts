import { Processor, WorkerHost } from '@nestjs/bullmq';
import type { Job } from 'bullmq';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { QUEUE_NAMES } from '../../../queue/queue.module';
import type { EnqueueNotificationDto } from '../dto/notifications.dto';

/**
 * The worked example the module's README points to. No SMS/email/push provider is configured in
 * this scaffold, so this just logs what it would have sent — never the full `data` payload
 * (which may carry patient information), only the template name and channel, matching the
 * "no unnecessary clinical detail" rule (blueprint §15). Swap the `send` case bodies for real
 * provider calls once TERMII_API_KEY / an email provider / FCM are configured.
 */
@Processor(QUEUE_NAMES.NOTIFICATIONS)
export class NotificationsProcessor extends WorkerHost {
  constructor(@InjectPinoLogger(NotificationsProcessor.name) private readonly logger: PinoLogger) {
    super();
  }

  async process(job: Job<EnqueueNotificationDto>): Promise<void> {
    const { channel, template, recipientUserAccountId } = job.data;
    this.logger.info({ channel, template, recipientUserAccountId, jobId: job.id }, 'Notification would be sent here');
    await Promise.resolve();
  }
}

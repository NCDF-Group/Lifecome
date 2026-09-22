import { createZodDto } from '../../../common/validation/zod-dto';
import { z } from 'zod';

/**
 * `template` names a versioned template (blueprint §15 — "all notification templates should be
 * versioned, localisable, testable and linked to event IDs"); the actual copy lives with whatever
 * channel provider is chosen, not in this service.
 */
export const EnqueueNotificationSchema = z.object({
  recipientUserAccountId: z.uuid(),
  channel: z.enum(['sms', 'email', 'push', 'in_app']),
  template: z.string().min(1).max(100),
  data: z.record(z.string(), z.unknown()).default({}),
});
export class EnqueueNotificationDto extends createZodDto(EnqueueNotificationSchema) {}

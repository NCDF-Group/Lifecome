import { createZodDto } from '../../../common/validation/zod-dto';
import { z } from 'zod';

export const CreatePaymentIntentSchema = z.object({
  appointmentId: z.uuid(),
  clinicalServiceId: z.uuid(),
  gateway: z.enum(['paystack', 'flutterwave']).default('paystack'),
  idempotencyKey: z.string().min(8),
});
export class CreatePaymentIntentDto extends createZodDto(CreatePaymentIntentSchema) {}

/** Simplified shape of the fields every gateway webhook needs, mapped from the real payload upstream. */
export const PaymentWebhookSchema = z.object({
  gatewayReference: z.string().min(1),
  status: z.enum(['successful', 'failed']),
});
export class PaymentWebhookDto extends createZodDto(PaymentWebhookSchema) {}

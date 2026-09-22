import { createZodDto } from '../../../common/validation/zod-dto';
import { z } from 'zod';

export const CreateAppointmentSchema = z.object({
  patientId: z.uuid(),
  providerId: z.uuid(),
  clinicalServiceId: z.uuid(),
  availabilitySlotId: z.uuid(),
  consultationMode: z.enum(['video', 'audio']).default('video'),
  presentingConcern: z.string().max(2000).optional(),
});
export class CreateAppointmentDto extends createZodDto(CreateAppointmentSchema) {}

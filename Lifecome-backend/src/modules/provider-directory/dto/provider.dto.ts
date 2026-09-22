import { createZodDto } from '../../../common/validation/zod-dto';
import { z } from 'zod';

export const CreateProviderSchema = z.object({
  displayName: z.string().min(1).max(200),
  specialty: z.string().min(1).max(120),
  languages: z.array(z.string().min(1)).default([]),
  consultationModes: z.array(z.enum(['video', 'audio'])).default(['video']),
});
export class CreateProviderDto extends createZodDto(CreateProviderSchema) {}

export const ListProvidersQuerySchema = z.object({
  specialty: z.string().optional(),
  language: z.string().optional(),
});
export class ListProvidersQueryDto extends createZodDto(ListProvidersQuerySchema) {}

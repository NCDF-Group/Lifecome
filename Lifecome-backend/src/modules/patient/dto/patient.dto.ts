import { createZodDto } from '../../../common/validation/zod-dto';
import { z } from 'zod';

export const CreatePatientProfileSchema = z.object({
  userAccountId: z.uuid(),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  dateOfBirth: z.iso.date(),
  sex: z.string().max(30).optional(),
  city: z.string().max(100).optional(),
});
export class CreatePatientProfileDto extends createZodDto(CreatePatientProfileSchema) {}

export const UpdatePatientProfileSchema = CreatePatientProfileSchema.partial().omit({ userAccountId: true });
export class UpdatePatientProfileDto extends createZodDto(UpdatePatientProfileSchema) {}

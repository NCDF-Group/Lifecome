import { createZodDto } from '../../../common/validation/zod-dto';
import { z } from 'zod';

export const CheckEligibilitySchema = z.object({
  membershipId: z.uuid(),
  clinicalServiceCode: z.string().min(1),
});
export class CheckEligibilityDto extends createZodDto(CheckEligibilitySchema) {}

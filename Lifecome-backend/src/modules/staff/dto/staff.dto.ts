import { z } from 'zod';

import { createZodDto } from '../../../common/validation/zod-dto';
import { PaginationQuerySchema } from '../../../common/dto/pagination.dto';

export const StaffRoleSchema = z.enum([
  'platform_administrator',
  'clinical_administrator',
  'hmo_operations',
  'support_agent',
]);

export const StaffStatusSchema = z.enum(['active', 'suspended']);

export const CreateStaffSchema = z.object({
  email: z.email(),
  password: z.string().min(10).max(200),
  fullName: z.string().min(1).max(200),
  role: StaffRoleSchema,
});
export class CreateStaffDto extends createZodDto(CreateStaffSchema) {}

export const UpdateStaffSchema = z.object({
  fullName: z.string().min(1).max(200).optional(),
  role: StaffRoleSchema.optional(),
  status: StaffStatusSchema.optional(),
});
export class UpdateStaffDto extends createZodDto(UpdateStaffSchema) {}

export const ListStaffQuerySchema = PaginationQuerySchema.extend({
  role: StaffRoleSchema.optional(),
  status: StaffStatusSchema.optional(),
});
export class ListStaffQueryDto extends createZodDto(ListStaffQuerySchema) {}

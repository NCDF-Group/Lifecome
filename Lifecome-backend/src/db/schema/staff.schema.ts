import { pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { staffAccountStatusEnum, staffRoleEnum } from './enums';

/**
 * Operations-console identity — deliberately separate from `userAccounts` (patient-only, the
 * "one patient identity" rule in `patient.schema.ts`). Staff sign in with email + password, not
 * phone + OTP, and have no clinical/demographic profile, so a parallel table is simpler than
 * bolting a role/account-kind discriminator onto `userAccounts`. See blueprint §2.3 for the roles.
 */
export const staffAccounts = pgTable(
  'staff_accounts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').notNull(),
    passwordHash: text('password_hash').notNull(),
    fullName: text('full_name').notNull(),
    role: staffRoleEnum('role').notNull(),
    status: staffAccountStatusEnum('status').notNull().default('active'),
    lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex('staff_accounts_email_idx').on(table.email)],
);

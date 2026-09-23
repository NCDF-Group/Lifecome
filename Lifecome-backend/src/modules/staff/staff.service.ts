import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { and, count, desc, eq } from 'drizzle-orm';

import { paginate, type PaginatedResult } from '../../common/dto/pagination.dto';
import { AppException, NotFoundAppException } from '../../common/errors/app-exception';
import { hashPassword, verifyPassword } from '../../common/security/password';
import { DRIZZLE, type Database } from '../../db/client';
import { staffAccounts } from '../../db/schema';
import type { CreateStaffDto, ListStaffQueryDto, UpdateStaffDto } from './dto/staff.dto';

export type StaffAccount = typeof staffAccounts.$inferSelect;
export type StaffSummary = Omit<StaffAccount, 'passwordHash'>;

function toSummary(account: StaffAccount): StaffSummary {
  const summary: Partial<StaffAccount> = { ...account };
  delete summary.passwordHash;
  return summary as StaffSummary;
}

/**
 * Operations-console staff accounts. Deliberately its own module rather than folded into
 * `IdentityModule` — see `staff.schema.ts` for why staff and patients are separate tables.
 */
@Injectable()
export class StaffService {
  constructor(@Inject(DRIZZLE) private readonly db: Database) {}

  async create(input: CreateStaffDto): Promise<StaffSummary> {
    const [existing] = await this.db.select().from(staffAccounts).where(eq(staffAccounts.email, input.email));
    if (existing) {
      throw new AppException('STAFF_EMAIL_TAKEN', 'A staff account with this email already exists.', HttpStatus.CONFLICT);
    }

    const passwordHash = await hashPassword(input.password);
    const [created] = await this.db
      .insert(staffAccounts)
      .values({ email: input.email, passwordHash, fullName: input.fullName, role: input.role })
      .returning();

    return toSummary(created);
  }

  async list(query: ListStaffQueryDto): Promise<PaginatedResult<StaffSummary>> {
    const conditions = [];
    if (query.role) conditions.push(eq(staffAccounts.role, query.role));
    if (query.status) conditions.push(eq(staffAccounts.status, query.status));
    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [{ total }] = await this.db.select({ total: count() }).from(staffAccounts).where(where);
    const rows = await this.db
      .select()
      .from(staffAccounts)
      .where(where)
      .orderBy(desc(staffAccounts.createdAt))
      .limit(query.pageSize)
      .offset((query.page - 1) * query.pageSize);

    return paginate(rows.map(toSummary), total, query.page, query.pageSize);
  }

  async getById(id: string): Promise<StaffSummary> {
    const [account] = await this.db.select().from(staffAccounts).where(eq(staffAccounts.id, id));
    if (!account) throw new NotFoundAppException('Staff account');
    return toSummary(account);
  }

  async update(id: string, input: UpdateStaffDto): Promise<StaffSummary> {
    await this.getById(id); // 404s early if missing
    const [updated] = await this.db
      .update(staffAccounts)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(staffAccounts.id, id))
      .returning();
    return toSummary(updated);
  }

  /** Used by `AuthService.login` only — never returns the password hash outward. */
  async verifyCredentials(email: string, password: string): Promise<StaffSummary | null> {
    const [account] = await this.db.select().from(staffAccounts).where(eq(staffAccounts.email, email));
    if (!account || account.status !== 'active') return null;

    const valid = await verifyPassword(password, account.passwordHash);
    if (!valid) return null;

    const [updated] = await this.db
      .update(staffAccounts)
      .set({ lastLoginAt: new Date() })
      .where(eq(staffAccounts.id, account.id))
      .returning();

    return toSummary(updated);
  }
}

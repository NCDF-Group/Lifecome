import { Inject, Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';

import { DRIZZLE, type Database } from '../../db/client';
import { providers } from '../../db/schema';
import { NotFoundAppException } from '../../common/errors/app-exception';
import type { CreateProviderDto } from './dto/provider.dto';

export type Provider = typeof providers.$inferSelect;

@Injectable()
export class ProviderDirectoryService {
  constructor(@Inject(DRIZZLE) private readonly db: Database) {}

  async list(filters: { specialty?: string }): Promise<Provider[]> {
    const conditions = [eq(providers.networkStatus, 'active')];
    if (filters.specialty) conditions.push(eq(providers.specialty, filters.specialty));
    return this.db
      .select()
      .from(providers)
      .where(conditions.length > 1 ? and(...conditions) : conditions[0]);
  }

  async getById(id: string): Promise<Provider> {
    const [provider] = await this.db.select().from(providers).where(eq(providers.id, id));
    if (!provider) throw new NotFoundAppException('Provider');
    return provider;
  }

  async create(input: CreateProviderDto): Promise<Provider> {
    const [created] = await this.db.insert(providers).values(input).returning();
    return created;
  }
}

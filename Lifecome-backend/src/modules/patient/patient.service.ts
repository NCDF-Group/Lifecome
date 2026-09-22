import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';

import { DRIZZLE, type Database } from '../../db/client';
import { patients } from '../../db/schema';
import { NotFoundAppException } from '../../common/errors/app-exception';
import type { CreatePatientProfileDto, UpdatePatientProfileDto } from './dto/patient.dto';

export type Patient = typeof patients.$inferSelect;

@Injectable()
export class PatientService {
  constructor(@Inject(DRIZZLE) private readonly db: Database) {}

  async createProfile(input: CreatePatientProfileDto): Promise<Patient> {
    const [created] = await this.db.insert(patients).values(input).returning();
    return created;
  }

  async getById(id: string): Promise<Patient> {
    const [found] = await this.db.select().from(patients).where(eq(patients.id, id));
    if (!found) throw new NotFoundAppException('Patient');
    return found;
  }

  async getByUserAccountId(userAccountId: string): Promise<Patient | undefined> {
    const [found] = await this.db.select().from(patients).where(eq(patients.userAccountId, userAccountId));
    return found;
  }

  async update(id: string, input: UpdatePatientProfileDto): Promise<Patient> {
    await this.getById(id); // 404s early if missing
    const [updated] = await this.db
      .update(patients)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(patients.id, id))
      .returning();
    return updated;
  }
}

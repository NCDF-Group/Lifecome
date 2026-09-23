export { staffRoleLabel, type StaffRole } from "@/lib/auth/roles";

// Mirrors Lifecome-backend's `StaffSummary` (src/modules/staff/staff.service.ts).
import type { StaffRole } from "@/lib/auth/roles";

export interface StaffMember {
  id: string;
  email: string;
  fullName: string;
  role: StaffRole;
  status: "active" | "suspended";
  lastLoginAt: string | null;
  createdAt: string;
}

/**
 * Demo staff accounts standing in for a future `GET /api/v1/staff`
 * (Lifecome-backend's `identity` module — see README.md "Known gap:
 * admin auth": the roles below match the blueprint's personas, §2.3, but
 * none of this exists on the backend yet).
 */
export type StaffRole =
  | "platform_administrator"
  | "clinical_administrator"
  | "hmo_operations"
  | "support_agent";

export type DemoStaffMember = {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  status: "active" | "invited" | "disabled";
};

export const staffRoleLabel: Record<StaffRole, string> = {
  platform_administrator: "Platform administrator",
  clinical_administrator: "Clinical administrator",
  hmo_operations: "HMO operations",
  support_agent: "Support agent",
};

export const demoStaff: DemoStaffMember[] = [
  {
    id: "staff-001",
    name: "Yemi Adisa",
    email: "yemi.adisa@lifecomelive.com",
    role: "platform_administrator",
    status: "active",
  },
  {
    id: "staff-002",
    name: "Dr. Funmi Adebayo",
    email: "funmi.adebayo@lifecomelive.com",
    role: "clinical_administrator",
    status: "active",
  },
  {
    id: "staff-003",
    name: "Bisi Lawal",
    email: "bisi.lawal@lifecomelive.com",
    role: "hmo_operations",
    status: "active",
  },
  {
    id: "staff-004",
    name: "Tobi Salako",
    email: "tobi.salako@lifecomelive.com",
    role: "support_agent",
    status: "invited",
  },
];

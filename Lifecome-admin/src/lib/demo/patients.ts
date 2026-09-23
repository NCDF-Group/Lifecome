/**
 * Demo patient records standing in for `GET /api/v1/patients` (Lifecome-
 * backend's `patient` module). Swap for a `useQuery` in
 * `features/patients/api.ts` once that endpoint exists — nothing else in
 * this module should need to change, since the shape below already
 * matches the mobile app's `PatientProfile` model.
 */
export type DemoPatient = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  payerName: string | null;
  memberSince: string;
  status: "active" | "inactive";
};

export const demoPatients: DemoPatient[] = [
  {
    id: "pat-001",
    fullName: "Ngozi Adeyemi",
    email: "ngozi.adeyemi@example.com",
    phoneNumber: "08012345678",
    payerName: "Reliance HMO",
    memberSince: "2026-02-24",
    status: "active",
  },
  {
    id: "pat-002",
    fullName: "Ada Okonkwo",
    email: "ada.okonkwo@example.com",
    phoneNumber: "08087654321",
    payerName: "Reliance HMO",
    memberSince: "2026-01-09",
    status: "active",
  },
  {
    id: "pat-003",
    fullName: "Emeka Nwosu",
    email: "emeka.nwosu@example.com",
    phoneNumber: "07011122233",
    payerName: null,
    memberSince: "2026-03-02",
    status: "active",
  },
  {
    id: "pat-004",
    fullName: "Folasade Ogunleye",
    email: "folasade.ogunleye@example.com",
    phoneNumber: "08122233344",
    payerName: "AVON HMO",
    memberSince: "2025-11-18",
    status: "inactive",
  },
  {
    id: "pat-005",
    fullName: "Chika Eze",
    email: "chika.eze@example.com",
    phoneNumber: "09033344455",
    payerName: "Hygeia HMO",
    memberSince: "2026-04-14",
    status: "active",
  },
];

export function getDemoPatient(id: string): DemoPatient | undefined {
  return demoPatients.find((patient) => patient.id === id);
}

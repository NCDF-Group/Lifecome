/**
 * Demo providers standing in for `GET /api/v1/providers` (Lifecome-
 * backend's `provider-directory` module). Shapes match Lifecome-mobile's
 * `Doctor` model, and reuse the same demo clinicians for cross-product
 * consistency.
 */
export type DemoProvider = {
  id: string;
  name: string;
  specialty: string;
  qualifications: string;
  yearsOfExperience: number;
  rating: number;
  reviewCount: number;
  clinicName: string;
  status: "active" | "suspended" | "pending_review";
};

export const demoProviders: DemoProvider[] = [
  {
    id: "doc-001",
    name: "Dr. Adaeze Okonkwo",
    specialty: "General Practice",
    qualifications: "MBBS, MWACP",
    yearsOfExperience: 9,
    rating: 4.8,
    reviewCount: 214,
    clinicName: "LifeCome Live — Lekki Hub",
    status: "active",
  },
  {
    id: "doc-002",
    name: "Dr. Tunde Bakare",
    specialty: "Cardiology",
    qualifications: "MBBS, FWACS (Cardiology)",
    yearsOfExperience: 14,
    rating: 4.9,
    reviewCount: 358,
    clinicName: "LifeCome Live — Ikeja Hub",
    status: "active",
  },
  {
    id: "doc-003",
    name: "Dr. Ifeoma Chukwu",
    specialty: "Paediatrics",
    qualifications: "MBBS, FMCPaed",
    yearsOfExperience: 11,
    rating: 4.9,
    reviewCount: 421,
    clinicName: "LifeCome Live — Lekki Hub",
    status: "active",
  },
  {
    id: "doc-004",
    name: "Dr. Chika Eze",
    specialty: "Dermatology",
    qualifications: "MBBS, FMCP (Dermatology)",
    yearsOfExperience: 7,
    rating: 4.7,
    reviewCount: 156,
    clinicName: "LifeCome Live — Victoria Island Hub",
    status: "pending_review",
  },
  {
    id: "doc-006",
    name: "Dr. Emeka Nwosu",
    specialty: "Psychiatry",
    qualifications: "MBBS, FWACP (Psychiatry)",
    yearsOfExperience: 10,
    rating: 4.9,
    reviewCount: 197,
    clinicName: "LifeCome Live — Virtual Only",
    status: "suspended",
  },
];

export function getDemoProvider(id: string): DemoProvider | undefined {
  return demoProviders.find((provider) => provider.id === id);
}

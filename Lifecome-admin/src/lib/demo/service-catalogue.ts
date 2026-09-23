/**
 * Demo bookable services standing in for `GET /api/v1/services`
 * (Lifecome-backend's `service-catalogue` module). Same services as
 * Lifecome-mobile's `FakeBookingRepository.listServices()`, since this is
 * the content that feeds both the public site's pricing and the mobile
 * booking flow.
 */
export type DemoService = {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  durationMinutes: number;
  active: boolean;
};

export const demoServices: DemoService[] = [
  {
    id: "svc-general",
    name: "General consultation",
    description: "For a new or ongoing everyday health concern.",
    basePrice: 8000,
    durationMinutes: 20,
    active: true,
  },
  {
    id: "svc-followup",
    name: "Follow-up visit",
    description: "Continue care from a previous consultation.",
    basePrice: 5000,
    durationMinutes: 15,
    active: true,
  },
  {
    id: "svc-specialist",
    name: "Specialist consultation",
    description: "See a specialist for a focused concern.",
    basePrice: 15000,
    durationMinutes: 30,
    active: true,
  },
  {
    id: "svc-second-opinion",
    name: "Second opinion",
    description: "Review an existing diagnosis or treatment plan.",
    basePrice: 12000,
    durationMinutes: 25,
    active: false,
  },
];

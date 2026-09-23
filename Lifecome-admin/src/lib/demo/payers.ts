/**
 * Demo payers standing in for `GET /api/v1/payers` (Lifecome-backend's
 * `payer` module). Reuses the same HMOs as Lifecome-mobile's
 * `FakePayerRepository`.
 */
export type DemoPayer = {
  id: string;
  name: string;
  shortCode: string;
  supportPhone: string;
  activeMembers: number;
  integrationStatus: "connected" | "degraded" | "not_connected";
};

export const demoPayers: DemoPayer[] = [
  {
    id: "payer-reliance",
    name: "Reliance HMO",
    shortCode: "RL",
    supportPhone: "0700 555 6666",
    activeMembers: 1284,
    integrationStatus: "connected",
  },
  {
    id: "payer-avon",
    name: "AVON HMO",
    shortCode: "AV",
    supportPhone: "0700 111 2222",
    activeMembers: 742,
    integrationStatus: "connected",
  },
  {
    id: "payer-hygeia",
    name: "Hygeia HMO",
    shortCode: "HY",
    supportPhone: "0700 333 4444",
    activeMembers: 589,
    integrationStatus: "degraded",
  },
  {
    id: "payer-axa",
    name: "AXA Mansard Health",
    shortCode: "AX",
    supportPhone: "0700 777 8888",
    activeMembers: 401,
    integrationStatus: "connected",
  },
  {
    id: "payer-leadway",
    name: "Leadway Health",
    shortCode: "LW",
    supportPhone: "0700 999 0000",
    activeMembers: 0,
    integrationStatus: "not_connected",
  },
];

export function getDemoPayer(id: string): DemoPayer | undefined {
  return demoPayers.find((payer) => payer.id === id);
}

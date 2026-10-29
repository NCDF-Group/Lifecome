import { apiClient } from "@/lib/api-client"

export const payerService = {
  /**
   * Links the patient to an employer or sponsor scheme. The employer's access code is the
   * payer code and the work email identifies the patient as a member.
   */
  async verifyMembership(payerCode: string, memberId: string): Promise<void> {
    await apiClient.post("/payers/verify-membership", { payerCode, memberId })
  },
}

export interface ParticipatingHmo {
  name: string;
  /** Only "live" HMOs are shown as accepted. Nothing is listed until commercial, operational and technical onboarding is complete. */
  status: "live";
}

/**
 * Participating HMO directory (blueprint §2.2: never imply an HMO is accepted before onboarding is complete).
 * LifeCome HMO may be listed first as a product decision, but it is not special-cased anywhere else.
 * Add entries here (or replace with API data) as each HMO goes live.
 */
export const participatingHmos: readonly ParticipatingHmo[] = [];

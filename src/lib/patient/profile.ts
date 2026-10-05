export type PatientProfile = Record<string, unknown>;

function asObject(value: unknown): PatientProfile | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? value as PatientProfile
    : null;
}

export function normalizePatientProfile(value: unknown): PatientProfile | null {
  const object = asObject(value);
  if (!object) return null;

  for (const key of ["data", "patient", "profile"]) {
    const nested = asObject(object[key]);
    if (nested) return normalizePatientProfile(nested) ?? nested;
  }
  return object;
}

export function patientField(profile: PatientProfile | null, ...keys: string[]): string {
  if (!profile) return "";

  for (const key of keys) {
    const value = profile[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }

  for (const key of ["user", "account", "patient"]) {
    const nested = asObject(profile[key]);
    if (nested) {
      const value = patientField(nested, ...keys);
      if (value) return value;
    }
  }
  return "";
}

export function patientName(profile: PatientProfile | null): string {
  const fullName = patientField(profile, "fullName", "name", "displayName");
  if (fullName) return fullName;

  const firstName = patientField(profile, "firstName", "givenName", "first_name");
  const lastName = patientField(profile, "lastName", "familyName", "last_name");
  const combined = `${firstName} ${lastName}`.trim();
  if (combined) return combined;

  const email = patientEmail(profile);
  return email ? email.split("@")[0] : "Patient";
}

export function patientEmail(profile: PatientProfile | null): string {
  return patientField(profile, "email", "emailAddress");
}

export function patientInitials(profile: PatientProfile | null): string {
  return patientName(profile)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

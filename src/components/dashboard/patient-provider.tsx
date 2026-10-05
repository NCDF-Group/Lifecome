"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  normalizePatientProfile,
  type PatientProfile,
} from "@/lib/patient/profile";

interface PatientContextValue {
  profile: PatientProfile | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

const PatientContext = createContext<PatientContextValue | null>(null);

export function PatientProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestNumber, setRequestNumber] = useState(0);

  const reload = useCallback(() => {
    setProfile(null);
    setError(null);
    setLoading(true);
    setRequestNumber((number) => number + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProfile() {
      try {
        const response = await fetch("/api/auth/patient", {
          cache: "no-store",
          signal: controller.signal,
        });

        if (response.status === 401) {
          router.replace("/sign-in");
          return;
        }

        let body: unknown;
        try {
          body = await response.json();
        } catch {
          body = null;
        }

        if (!response.ok) {
          const message =
            typeof body === "object" && body !== null && "message" in body &&
            typeof body.message === "string"
              ? body.message
              : "Unable to load your patient profile.";
          throw new Error(message);
        }

        const patient = normalizePatientProfile(body);
        if (!patient) {
          throw new Error("The patient profile response was not in the expected format.");
        }
        setProfile(patient);
      } catch (cause) {
        if (cause instanceof Error && cause.name === "AbortError") return;
        setError(cause instanceof Error ? cause.message : "Unable to load your patient profile.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadProfile();
    return () => controller.abort();
  }, [requestNumber, router]);

  return (
    <PatientContext.Provider value={{ profile, loading, error, reload }}>
      {children}
    </PatientContext.Provider>
  );
}

export function usePatientProfile(): PatientContextValue {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error("usePatientProfile must be used within PatientProvider.");
  }
  return context;
}

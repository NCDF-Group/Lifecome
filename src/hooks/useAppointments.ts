"use client"

import { appointmentService, type AvailabilitySlot, type ClinicalService } from "@/services/appointment.service"
import type { Appointment, Doctor } from "@/types"
import { useResource } from "./useResource"

const fetchAppointment = (id: string) => appointmentService.getAppointment(id)
const fetchAvailability = (providerId: string) => appointmentService.getAvailability(providerId)
const fetchClinicalServices = () => appointmentService.getClinicalServices()
const fetchOnlineProviders = (specialty: string) => appointmentService.getProviders({ specialty, consultationMode: "video" })

export const useAppointment = (id: string | null) =>
  useResource<Appointment>(id, fetchAppointment, "We couldn't load this appointment.")

export const useAvailability = (providerId: string | null) =>
  useResource<AvailabilitySlot[]>(providerId, fetchAvailability, "We couldn't load available times.")

export const useClinicalServices = () =>
  useResource<ClinicalService[]>("all", fetchClinicalServices, "We couldn't load appointment types.")

export const useOnlineProviders = (specialty: string) =>
  useResource<Doctor[]>(specialty, fetchOnlineProviders, "We couldn't load clinicians.")

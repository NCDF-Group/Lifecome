"use client"

import { appointmentService, type AvailabilitySlot } from "@/services/appointment.service"
import type { Appointment } from "@/types"
import { useResource } from "./useResource"

const fetchAppointments = () => appointmentService.getAppointments()
const fetchAppointment = (id: string) => appointmentService.getAppointment(id)
const fetchAvailability = (providerId: string) => appointmentService.getAvailability(providerId)

export const useAppointments = () =>
  useResource<Appointment[]>("all", fetchAppointments, "We couldn't load your appointments.")

export const useAppointment = (id: string) =>
  useResource<Appointment>(id, fetchAppointment, "We couldn't load this appointment.")

export const useAvailability = (providerId: string | null) =>
  useResource<AvailabilitySlot[]>(providerId, fetchAvailability, "We couldn't load available times.")

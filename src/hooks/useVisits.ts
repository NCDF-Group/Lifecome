"use client"

import { visitService } from "@/services/visit.service"
import type { Visit } from "@/types"
import { useResource } from "./useResource"

const fetchVisits = () => visitService.getVisits()

export const useVisits = () => useResource<Visit[]>("all", fetchVisits, "We couldn't load your visits.")

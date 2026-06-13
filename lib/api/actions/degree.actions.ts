"use server"

import { action } from "@/lib/api/action.server"
import { http } from "@/lib/api/http.server"
import { degreeService } from "@/lib/api/services/degree.service.server"

export async function getDegreesAction() {
  return action(() => degreeService.getAll())
}

export async function joinDegreeAction(degreeId: string, currentYear?: number) {
  return action(() =>
    http.put<void>(`/users/me/degrees/${degreeId}`, {
      body: currentYear !== undefined ? { currentYear } : {},
      auth: true,
    }),
  )
}

export async function leaveDegreeAction(degreeId: string) {
  return action(() => http.del<void>(`/users/me/degrees/${degreeId}`, { auth: true }))
}

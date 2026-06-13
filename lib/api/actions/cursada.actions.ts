"use server"

import { action } from "@/lib/api/action.server"
import { http } from "@/lib/api/http.server"
import { subjectService } from "@/lib/api/services/subject.service.server"
import { departmentService } from "@/lib/api/services/department.service.server"
import type { Cursada, CursadaStatus } from "@/lib/api/dtos/responses/cursada"

export async function getCursadasAction() {
  return action(() => http.get<Cursada[]>("/users/me/cursadas", { auth: true }))
}

export async function getSubjectsAction() {
  return action(() => subjectService.getAll())
}

export async function getDepartmentsAction() {
  return action(() => departmentService.getAll())
}

export async function addCursadaAction(payload: {
  subjectId: string
  status: CursadaStatus
  departmentId?: string
}) {
  return action(() => http.post<Cursada>("/users/me/cursadas", { body: payload, auth: true }))
}

export async function deleteCursadaAction(id: string) {
  return action(() => http.del<void>(`/users/me/cursadas/${id}`, { auth: true }))
}

"use server"

import { action } from "@/lib/api/action.server"
import { http } from "@/lib/api/http.server"
import { subjectService } from "@/lib/api/services/subject.service.server"
import { departmentService } from "@/lib/api/services/department.service.server"
import type { Cursada, CursadaStatus } from "@/lib/api/dtos/responses/cursada"

export async function getCursadasAction() {
  return action(() => http.get<Cursada[]>("/cursadas", { auth: true }))
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
  return action(() => http.post<Cursada>("/cursadas", { body: payload, auth: true }))
}

export async function editCursadaAction(
  id: string,
  payload: { status?: CursadaStatus; departmentId?: string; degreeId?: string },
) {
  return action(() => http.patch<Cursada>(`/cursadas/${id}`, { body: payload, auth: true }))
}

export async function deleteCursadaAction(id: string) {
  return action(() => http.del<void>(`/cursadas/${id}`, { auth: true }))
}

"use client"

import { useState, useEffect, useTransition } from "react"
import { Plus, X, GraduationCap, Loader2 } from "lucide-react"
import { SectionCard, FieldLabel, SelectInput } from "./settings-fields"
import { Toast } from "./toast"
import {
  getCursadasAction,
  getSubjectsAction,
  getDepartmentsAction,
  addCursadaAction,
  deleteCursadaAction,
} from "@/lib/api/actions/cursada.actions"
import type { Cursada, CursadaStatus } from "@/lib/api/dtos/responses/cursada"
import type { SubjectItem } from "@/lib/api/dtos/responses/subject"
import type { DepartmentStats } from "@/lib/api/dtos/responses/department"

const STATUS_LABEL: Record<CursadaStatus, string> = {
  CURSANDO: "Cursando",
  REGULAR: "Regular",
  APROBADA: "Aprobada",
  ABANDONADA: "Abandonada",
}

const STATUS_CLASS: Record<CursadaStatus, string> = {
  CURSANDO: "bg-primary/15 text-primary",
  APROBADA: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  REGULAR: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  ABANDONADA: "bg-destructive/15 text-destructive",
}

export function CoursesPanel() {
  const toast = Toast.useToastManager()

  const [cursadas, setCursadas] = useState<Cursada[]>([])
  const [subjects, setSubjects] = useState<SubjectItem[]>([])
  const [departments, setDepartments] = useState<DepartmentStats[]>([])
  const [loadingData, setLoadingData] = useState(true)

  const [subjectId, setSubjectId] = useState("")
  const [departmentId, setDepartmentId] = useState("")
  const [status, setStatus] = useState<CursadaStatus>("CURSANDO")

  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    Promise.all([getCursadasAction(), getSubjectsAction(), getDepartmentsAction()]).then(
      ([cursadasRes, subjectsRes, depsRes]) => {
        if (cursadasRes.success) setCursadas(cursadasRes.data)
        if (subjectsRes.success) setSubjects(subjectsRes.data)
        if (depsRes.success) setDepartments(depsRes.data)
        setLoadingData(false)
      },
    )
  }, [])

  // Cátedras disponibles para la materia seleccionada
  const selectedSubject = subjects.find((s) => String(s.id) === subjectId)
  const availableDepts = selectedSubject
    ? departments.filter((d) => selectedSubject.departments.some((sd) => sd.slug === d.slug))
    : []

  function handleSubjectChange(id: string) {
    setSubjectId(id)
    setDepartmentId("") // reset cátedra al cambiar materia
  }

  function handleAdd() {
    if (!subjectId) return
    startTransition(async () => {
      const res = await addCursadaAction({
        subjectId,
        status,
        ...(departmentId ? { departmentId } : {}),
      })
      if (!res.success) {
        const msg =
          res.code === "CURSADA_DUPLICATE"
            ? "Ya tenés esta materia registrada para ese cuatrimestre."
            : res.error
        toast.add({ title: "No se pudo agregar", description: msg, type: "error" })
        return
      }
      setCursadas((prev) => [...prev, res.data])
      setSubjectId("")
      setDepartmentId("")
      setStatus("CURSANDO")
      toast.add({ title: "Materia agregada", type: "success" })
    })
  }

  function handleDelete(id: string, name: string) {
    startTransition(async () => {
      const res = await deleteCursadaAction(id)
      if (!res.success) {
        toast.add({ title: "No se pudo quitar", description: res.error, type: "error" })
        return
      }
      setCursadas((prev) => prev.filter((c) => c.id !== id))
      toast.add({ title: `${name} quitada`, type: "success" })
    })
  }

  return (
    <SectionCard
      title="Carrera y materias"
      description="Registrá las materias que ya cursaste o estás cursando."
    >
      <div className="border-border flex flex-col gap-3 border-t pt-6">
        <div className="flex items-center justify-between">
          <FieldLabel>Materias cursadas</FieldLabel>
          {!loadingData && (
            <span className="text-muted-foreground font-mono text-[0.7rem] tracking-[0.14em] uppercase">
              {cursadas.length} {cursadas.length === 1 ? "materia" : "materias"}
            </span>
          )}
        </div>

        {loadingData ? (
          <div className="text-muted-foreground flex items-center gap-2 py-4 text-sm">
            <Loader2 className="size-4 animate-spin" />
            Cargando materias…
          </div>
        ) : cursadas.length === 0 ? (
          <p className="text-muted-foreground py-2 text-sm">
            Todavía no agregaste ninguna materia.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {cursadas.map((c) => (
              <li
                key={c.id}
                className="border-border bg-secondary/40 flex items-center gap-3 rounded-xl border px-4 py-3"
              >
                <GraduationCap className="text-primary size-4 shrink-0" strokeWidth={1.5} />
                <div className="min-w-0 flex-1 leading-tight">
                  <p className="text-foreground truncate text-sm">{c.subject.name}</p>
                  {c.department && (
                    <p className="text-muted-foreground font-mono text-[0.7rem] tracking-widest uppercase">
                      {c.department.name}
                    </p>
                  )}
                </div>
                <span
                  className={`shrink-0 rounded-md px-2 py-0.5 font-mono text-[0.65rem] font-medium tracking-wide uppercase ${STATUS_CLASS[c.status]}`}
                >
                  {STATUS_LABEL[c.status]}
                </span>
                <button
                  type="button"
                  onClick={() => handleDelete(c.id, c.subject.name)}
                  disabled={isPending}
                  aria-label={`Quitar ${c.subject.name}`}
                  className="text-muted-foreground hover:bg-destructive/15 hover:text-destructive flex size-7 shrink-0 items-center justify-center rounded-lg transition-colors disabled:opacity-40"
                >
                  <X className="size-4" strokeWidth={1.5} />
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Agregar materia */}
        <div className="border-border flex flex-col gap-2.5 rounded-xl border border-dashed p-3">
          <div className="grid gap-2.5 sm:grid-cols-2">
            <SelectInput
              value={subjectId}
              onChange={(e) => handleSubjectChange(e.target.value)}
              disabled={loadingData}
            >
              <option value="">Seleccioná una materia</option>
              {subjects.map((s) => (
                <option key={s.id} value={String(s.id)}>
                  {s.name}
                </option>
              ))}
            </SelectInput>

            <SelectInput
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              disabled={!subjectId || availableDepts.length === 0 || loadingData}
            >
              <option value="">
                {!subjectId
                  ? "Cátedra (elegí una materia primero)"
                  : availableDepts.length === 0
                    ? "Sin cátedras disponibles"
                    : "Cátedra (opcional)"}
              </option>
              {availableDepts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </SelectInput>
          </div>

          <div className="flex gap-2.5">
            <SelectInput
              value={status}
              onChange={(e) => setStatus(e.target.value as CursadaStatus)}
              disabled={loadingData}
            >
              {(Object.keys(STATUS_LABEL) as CursadaStatus[]).map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABEL[s]}
                </option>
              ))}
            </SelectInput>

            <button
              type="button"
              onClick={handleAdd}
              disabled={!subjectId || isPending || loadingData}
              className="border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Plus className="size-4" strokeWidth={2} />
              )}
              Agregar
            </button>
          </div>
        </div>
      </div>
    </SectionCard>
  )
}

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
import {
  getDegreesAction,
  joinDegreeAction,
  leaveDegreeAction,
} from "@/lib/api/actions/degree.actions"
import type { Cursada, CursadaStatus } from "@/lib/api/dtos/responses/cursada"
import type { SubjectItem } from "@/lib/api/dtos/responses/subject"
import type { DepartmentStats } from "@/lib/api/dtos/responses/department"
import type { DegreeItem } from "@/lib/api/dtos/responses/degree"
import type { Me } from "@/lib/api/dtos/responses/me"

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

const YEAR_LABELS: Record<number, string> = {
  1: "1er año",
  2: "2do año",
  3: "3er año",
  4: "4to año",
  5: "5to año",
  6: "6to año",
  7: "7mo año",
}

type EnrolledDegree = Me["degrees"][number]

// ─────────────────────────────────────────────────────────────────────────────
// CarreraPanel
// ─────────────────────────────────────────────────────────────────────────────

export function CarreraPanel({ me }: { me: Me }) {
  const toast = Toast.useToastManager()

  const [enrolledDegrees, setEnrolledDegrees] = useState<EnrolledDegree[]>(me.degrees)
  const [allDegrees, setAllDegrees] = useState<DegreeItem[]>([])
  const [loadingDegrees, setLoadingDegrees] = useState(true)
  const [selectedDegreeId, setSelectedDegreeId] = useState("")
  const [selectedYear, setSelectedYear] = useState("")
  const [degreesPending, startDegreeTransition] = useTransition()

  useEffect(() => {
    getDegreesAction().then((res) => {
      if (res.success) setAllDegrees(res.data)
      setLoadingDegrees(false)
    })
  }, [])

  const enrolledIds = new Set(enrolledDegrees.map((d) => d.id))
  const availableToJoin = allDegrees.filter((d) => !enrolledIds.has(d.id))

  function handleJoinDegree() {
    const degree = allDegrees.find((d) => String(d.id) === selectedDegreeId)
    if (!degree) return
    const year = selectedYear ? Number(selectedYear) : null
    startDegreeTransition(async () => {
      const res = await joinDegreeAction(selectedDegreeId, year ?? undefined)
      if (!res.success) {
        toast.add({ title: "No se pudo anotar", description: res.error, type: "error" })
        return
      }
      setEnrolledDegrees((prev) => [
        ...prev,
        { id: degree.id, name: degree.name, slug: degree.slug, currentYear: year ?? null },
      ])
      setSelectedDegreeId("")
      setSelectedYear("")
      toast.add({ title: `Anotado en ${degree.name}`, type: "success" })
    })
  }

  function handleLeaveDegree(degree: EnrolledDegree) {
    startDegreeTransition(async () => {
      const res = await leaveDegreeAction(String(degree.id))
      if (!res.success) {
        toast.add({ title: "No se pudo salir", description: res.error, type: "error" })
        return
      }
      setEnrolledDegrees((prev) => prev.filter((d) => d.id !== degree.id))
      toast.add({ title: `Saliste de ${degree.name}`, type: "success" })
    })
  }

  return (
    <SectionCard
      title="Carrera"
      description="Las carreras de FADU en las que estás cursando. Podés tener más de una si hacés doble carrera."
    >
      <div className="flex flex-col gap-3">
        {enrolledDegrees.length > 0 && (
          <ul className="flex flex-col gap-2">
            {enrolledDegrees.map((d) => (
              <li
                key={d.id}
                className="border-border bg-secondary/40 flex items-center gap-3 rounded-xl border px-4 py-3"
              >
                <GraduationCap className="text-primary size-4 shrink-0" strokeWidth={1.5} />
                <div className="min-w-0 flex-1 leading-tight">
                  <p className="text-foreground truncate text-sm font-medium">{d.name}</p>
                </div>
                {d.currentYear !== null && (
                  <span className="bg-primary/15 text-primary shrink-0 rounded-md px-2 py-0.5 font-mono text-[0.65rem] font-medium tracking-wide uppercase">
                    {YEAR_LABELS[d.currentYear] ?? `Año ${d.currentYear}`}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => handleLeaveDegree(d)}
                  disabled={degreesPending}
                  aria-label={`Salir de ${d.name}`}
                  className="text-muted-foreground hover:bg-destructive/15 hover:text-destructive flex size-7 shrink-0 items-center justify-center rounded-lg transition-colors disabled:opacity-40"
                >
                  <X className="size-4" strokeWidth={1.5} />
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="border-border flex flex-col gap-2.5 rounded-xl border border-dashed p-3">
          <div className="flex gap-2.5">
            <SelectInput
              value={selectedDegreeId}
              onChange={(e) => setSelectedDegreeId(e.target.value)}
              disabled={loadingDegrees}
              className="flex-1"
            >
              <option value="">
                {loadingDegrees ? "Cargando carreras…" : "Seleccioná una carrera"}
              </option>
              {availableToJoin.map((d) => (
                <option key={d.id} value={String(d.id)}>
                  {d.name}
                </option>
              ))}
            </SelectInput>

            <SelectInput
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              disabled={!selectedDegreeId}
              className="w-36 shrink-0"
            >
              <option value="">Año (opcional)</option>
              {Object.entries(YEAR_LABELS).map(([val, label]) => (
                <option key={val} value={val}>
                  {label}
                </option>
              ))}
            </SelectInput>

            <button
              type="button"
              onClick={handleJoinDegree}
              disabled={!selectedDegreeId || degreesPending || loadingDegrees}
              className="border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40"
            >
              {degreesPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Plus className="size-4" strokeWidth={2} />
              )}
              Anotarse
            </button>
          </div>
        </div>
      </div>
    </SectionCard>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MateriasPanel
// ─────────────────────────────────────────────────────────────────────────────

export function MateriasPanel() {
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

  const selectedSubject = subjects.find((s) => String(s.id) === subjectId)
  const availableDepts = selectedSubject
    ? departments.filter((d) => selectedSubject.departments.some((sd) => sd.slug === d.slug))
    : []

  function handleSubjectChange(id: string) {
    setSubjectId(id)
    setDepartmentId("")
  }

  function handleAddCursada() {
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

  function handleDeleteCursada(id: string, name: string) {
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
    <SectionCard title="Materias cursadas">
      <div className="flex flex-col gap-3">
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
                  onClick={() => handleDeleteCursada(c.id, c.subject.name)}
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
              onClick={handleAddCursada}
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

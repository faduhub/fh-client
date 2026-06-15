"use client"

import { useState, useEffect, useTransition } from "react"
import { Dialog } from "@base-ui/react/dialog"
import { Plus, X, GraduationCap, Loader2 } from "lucide-react"
import { SectionCard, SelectInput } from "./settings-fields"
import { Combobox } from "./combobox"
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

export function MateriasPanel() {
  const toast = Toast.useToastManager()

  const [cursadas, setCursadas] = useState<Cursada[]>([])
  const [subjects, setSubjects] = useState<SubjectItem[]>([])
  const [departments, setDepartments] = useState<DepartmentStats[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
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

  function handleOpenChange(open: boolean) {
    setDialogOpen(open)
    if (!open) {
      setSubjectId("")
      setDepartmentId("")
      setStatus("CURSANDO")
    }
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
      handleOpenChange(false)
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
        {loadingData ? (
          <div className="text-muted-foreground flex items-center gap-2 py-4 text-sm">
            <Loader2 className="size-4 animate-spin" />
            Cargando materias…
          </div>
        ) : cursadas.length === 0 ? (
          <p className="border-border bg-secondary/30 text-muted-foreground rounded-xl border border-dashed px-4 py-6 text-center text-sm">
            Todavía no agregaste ninguna carrera.
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

        <Dialog.Root open={dialogOpen} onOpenChange={handleOpenChange}>
          <Dialog.Trigger
            disabled={loadingData}
            className="border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 inline-flex items-center justify-center gap-1.5 self-start rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors"
          >
            <Plus className="size-4" strokeWidth={2} />
            Agregar
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[1px] transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0" />
            <Dialog.Popup className="border-border bg-card fixed top-1/2 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 flex-col gap-5 rounded-2xl border p-6 shadow-lg transition-all duration-150 outline-none data-ending-style:scale-[0.97] data-ending-style:opacity-0 data-starting-style:scale-[0.97] data-starting-style:opacity-0">
              <div>
                <Dialog.Title className="text-foreground text-base font-semibold">
                  Agregar materia
                </Dialog.Title>
                <Dialog.Description className="text-muted-foreground mt-1 text-sm">
                  Seleccioná la materia, la cátedra y el estado actual.
                </Dialog.Description>
              </div>

              <div className="flex flex-col gap-3">
                <Combobox
                  label="Seleccioná una materia"
                  value={subjectId}
                  onChange={handleSubjectChange}
                  options={subjects.map((s) => ({
                    value: String(s.id),
                    label: s.name,
                  }))}
                />

                <SelectInput
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  disabled={!subjectId || availableDepts.length === 0}
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

                <SelectInput
                  value={status}
                  onChange={(e) => setStatus(e.target.value as CursadaStatus)}
                >
                  {(Object.keys(STATUS_LABEL) as CursadaStatus[]).map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABEL[s]}
                    </option>
                  ))}
                </SelectInput>
              </div>

              <div className="flex justify-end gap-2">
                <Dialog.Close className="text-muted-foreground hover:bg-secondary hover:text-foreground inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm transition-colors">
                  Cancelar
                </Dialog.Close>
                <button
                  type="button"
                  onClick={handleAddCursada}
                  disabled={!subjectId || isPending}
                  className="border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 inline-flex items-center justify-center gap-1.5 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Plus className="size-4" strokeWidth={2} />
                  )}
                  Agregar
                </button>
              </div>
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </SectionCard>
  )
}

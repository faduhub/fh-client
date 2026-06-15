"use client"

import { useState, useEffect, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Dialog } from "@base-ui/react/dialog"
import { Menu } from "@base-ui/react/menu"
import {
  Plus,
  X,
  Loader2,
  BookOpen,
  ChevronsUpDown,
  Check,
  GraduationCap,
  Settings2,
} from "lucide-react"
import { SectionCard, SelectInput, ToggleOptions } from "./settings-fields"
import { Button } from "./button"
import { Combobox } from "./combobox"
import { GradientAvatar } from "./gradient-avatar"
import { ConfirmDialog } from "./confirm-dialog"
import { Toast } from "./toast"
import {
  getDegreesAction,
  joinDegreeAction,
  leaveDegreeAction,
} from "@/lib/api/actions/degree.actions"
import {
  getCursadasAction,
  getSubjectsAction,
  getDepartmentsAction,
  addCursadaAction,
  deleteCursadaAction,
} from "@/lib/api/actions/cursada.actions"
import type { DegreeItem } from "@/lib/api/dtos/responses/degree"
import type { Me } from "@/lib/api/dtos/responses/me"
import type { Cursada, CursadaStatus, AcademicPeriod } from "@/lib/api/dtos/responses/cursada"
import type { SubjectItem } from "@/lib/api/dtos/responses/subject"
import type { DepartmentStats } from "@/lib/api/dtos/responses/department"

const STATUS_LABEL: Record<CursadaStatus, string> = {
  CURSANDO: "Cursando",
  REGULAR: "Regular",
  APROBADA: "Aprobada",
  ABANDONADA: "Abandonada",
}

const STATUS_CLASS: Record<CursadaStatus, string> = {
  CURSANDO: "border-primary/40 text-primary",
  APROBADA: "border-emerald-500/40 text-emerald-600 dark:text-emerald-400",
  REGULAR: "border-amber-500/40 text-amber-600 dark:text-amber-400",
  ABANDONADA: "border-destructive/40 text-destructive",
}

const PERIOD_LABEL: Record<AcademicPeriod, string> = {
  FIRST: "1° cuatrimestre",
  SECOND: "2° cuatrimestre",
  SUMMER: "Verano",
}

const eyebrowClass = "text-muted-foreground font-mono text-[0.7rem] tracking-widest uppercase"
const pillButtonClass =
  "border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 inline-flex items-center justify-center gap-1.5 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40"
const popupClass =
  "min-w-[var(--anchor-width)] overflow-hidden rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-md data-entering:animate-in data-entering:fade-in-50 data-entering:zoom-in-95"
const menuItemClass =
  "flex w-full cursor-default items-center gap-2 rounded-lg px-2.5 py-2 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground"

type EnrolledDegree = Me["degrees"][number]

export function CursadasPanel({ me }: { me: Me }) {
  const toast = Toast.useToastManager()
  const router = useRouter()

  // --- Carreras ---
  const [enrolledDegrees, setEnrolledDegrees] = useState<EnrolledDegree[]>(me.degrees)
  const [activeDegreeId, setActiveDegreeId] = useState<number | null>(me.degrees[0]?.id ?? null)
  const [allDegrees, setAllDegrees] = useState<DegreeItem[]>([])
  const [loadingDegrees, setLoadingDegrees] = useState(true)
  const [carreraDialogOpen, setCarreraDialogOpen] = useState(false)
  const [selectedDegreeId, setSelectedDegreeId] = useState("")
  const [degreesPending, startDegreeTransition] = useTransition()

  // --- Materias ---
  const [cursadas, setCursadas] = useState<Cursada[]>([])
  const [subjects, setSubjects] = useState<SubjectItem[]>([])
  const [departments, setDepartments] = useState<DepartmentStats[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [materiaDialogOpen, setMateriaDialogOpen] = useState(false)
  const [subjectId, setSubjectId] = useState("")
  const [departmentId, setDepartmentId] = useState("")
  const [status, setStatus] = useState<CursadaStatus>("CURSANDO")
  const [cursadaToDelete, setCursadaToDelete] = useState<Cursada | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    getDegreesAction().then((res) => {
      if (res.success) setAllDegrees(res.data)
      setLoadingDegrees(false)
    })
    Promise.all([getCursadasAction(), getSubjectsAction(), getDepartmentsAction()]).then(
      ([cursadasRes, subjectsRes, depsRes]) => {
        if (cursadasRes.success) setCursadas(cursadasRes.data)
        if (subjectsRes.success) setSubjects(subjectsRes.data)
        if (depsRes.success) setDepartments(depsRes.data)
        setLoadingData(false)
      },
    )
  }, [])

  const enrolledIds = new Set(enrolledDegrees.map((d) => d.id))
  const availableToJoin = allDegrees.filter((d) => !enrolledIds.has(d.id))

  const activeDegree =
    enrolledDegrees.find((d) => d.id === activeDegreeId) ?? enrolledDegrees[0] ?? null

  // Con doble carrera, filtramos por la carrera activa (las cursadas sin
  // carrera asignada se muestran siempre).
  const visibleCursadas =
    activeDegree && enrolledDegrees.length > 1
      ? cursadas.filter((c) => !c.degree || c.degree.slug === activeDegree.slug)
      : cursadas

  const selectedSubject = subjects.find((s) => String(s.id) === subjectId)
  const availableDepts = selectedSubject
    ? departments.filter((d) => selectedSubject.departments.some((sd) => sd.slug === d.slug))
    : []

  // --- Handlers carreras ---
  function handleJoinDegree() {
    const degree = allDegrees.find((d) => String(d.id) === selectedDegreeId)
    if (!degree) return
    startDegreeTransition(async () => {
      const res = await joinDegreeAction(selectedDegreeId)
      if (!res.success) {
        toast.add({ title: "No se pudo anotar", description: res.error, type: "error" })
        return
      }
      setEnrolledDegrees((prev) => [
        ...prev,
        { id: degree.id, name: degree.name, slug: degree.slug, currentYear: null },
      ])
      if (enrolledDegrees.length === 0) setActiveDegreeId(degree.id)
      setSelectedDegreeId("")
      toast.add({ title: `Anotado en ${degree.name}`, type: "success" })
      router.refresh()
    })
  }

  function handleLeaveDegree(degree: EnrolledDegree) {
    startDegreeTransition(async () => {
      const res = await leaveDegreeAction(String(degree.id))
      if (!res.success) {
        toast.add({ title: "No se pudo salir", description: res.error, type: "error" })
        return
      }
      const next = enrolledDegrees.filter((d) => d.id !== degree.id)
      setEnrolledDegrees(next)
      if (activeDegreeId === degree.id) setActiveDegreeId(next[0]?.id ?? null)
      toast.add({ title: `Saliste de ${degree.name}`, type: "success" })
      router.refresh()
    })
  }

  // --- Handlers materias ---
  function handleSubjectChange(id: string) {
    setSubjectId(id)
    setDepartmentId("")
  }

  function handleMateriaOpenChange(open: boolean) {
    setMateriaDialogOpen(open)
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
      handleMateriaOpenChange(false)
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

  const carreraDialog = (
    <Dialog.Root open={carreraDialogOpen} onOpenChange={setCarreraDialogOpen}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[1px] transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Dialog.Popup className="border-border bg-card fixed top-1/2 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 flex-col gap-5 rounded-2xl border p-6 shadow-lg transition-all duration-150 outline-none data-ending-style:scale-[0.97] data-ending-style:opacity-0 data-starting-style:scale-[0.97] data-starting-style:opacity-0">
          <div>
            <Dialog.Title className="text-foreground text-base font-semibold">
              Tus carreras
            </Dialog.Title>
            <Dialog.Description className="text-muted-foreground mt-1 text-sm">
              Podés tener más de una si hacés doble carrera.
            </Dialog.Description>
          </div>

          {enrolledDegrees.length > 0 && (
            <ul className="flex flex-col gap-2">
              {enrolledDegrees.map((d) => (
                <li
                  key={d.id}
                  className="border-border bg-secondary/40 flex items-center gap-3 rounded-xl border px-4 py-3"
                >
                  <div className="min-w-0 flex-1 leading-tight">
                    <p className="text-foreground truncate text-sm font-medium">{d.name}</p>
                  </div>
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

          <div className="border-border flex flex-col gap-3 border-t pt-4">
            <p className={eyebrowClass}>Agregar carrera</p>
            <SelectInput
              value={selectedDegreeId}
              onChange={(e) => setSelectedDegreeId(e.target.value)}
            >
              <option value="">Seleccioná una carrera</option>
              {availableToJoin.map((d) => (
                <option key={d.id} value={String(d.id)}>
                  {d.name}
                </option>
              ))}
            </SelectInput>

            <button
              type="button"
              onClick={handleJoinDegree}
              disabled={!selectedDegreeId || degreesPending}
              className={`${pillButtonClass} self-start`}
            >
              {degreesPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Plus className="size-4" strokeWidth={2} />
              )}
              Anotarse
            </button>
          </div>

          <div className="flex justify-end">
            <Dialog.Close className="text-muted-foreground hover:bg-secondary hover:text-foreground inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm transition-colors">
              Listo
            </Dialog.Close>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )

  // --- Empty state: sin carrera ---
  if (enrolledDegrees.length === 0) {
    return (
      <>
        <div className="border-border bg-card/80 flex flex-col items-center gap-4 rounded-2xl border border-dashed px-6 py-16 text-center backdrop-blur-sm">
          <div className="bg-secondary/60 flex size-12 items-center justify-center rounded-full">
            <GraduationCap className="text-primary size-6" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-foreground font-serif text-lg font-medium">
              Todavía no cargaste tu carrera
            </p>
            <p className="text-muted-foreground mx-auto mt-1 max-w-xs text-sm">
              Agregá tu carrera para empezar a registrar las materias que cursás.
            </p>
          </div>
          <Button
            onClick={() => setCarreraDialogOpen(true)}
            disabled={loadingDegrees}
            className="rounded-full"
          >
            <Plus />
            Agregar carrera
          </Button>
        </div>
        {carreraDialog}
      </>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
        {/* Carrera (dropdown) */}
        <aside className="lg:sticky lg:top-8 lg:w-64 lg:shrink-0">
          <Menu.Root>
            <Menu.Trigger className="border-border bg-card/80 hover:bg-secondary/40 flex w-full items-center gap-3 rounded-2xl border p-4 text-left backdrop-blur-sm transition-colors">
              <GradientAvatar
                seed={activeDegree?.name ?? "?"}
                className="border-border size-11 shrink-0 border"
              />
              <div className="min-w-0 flex-1 leading-tight">
                <p className="text-foreground truncate text-sm font-medium">{activeDegree?.name}</p>
                {me.username && <p className={`truncate ${eyebrowClass}`}>@{me.username}</p>}
              </div>
              <ChevronsUpDown className="text-muted-foreground size-4 shrink-0" />
            </Menu.Trigger>
            <Menu.Portal>
              <Menu.Positioner side="bottom" align="start" sideOffset={6} className="z-50">
                <Menu.Popup className={popupClass}>
                  {enrolledDegrees.map((d) => (
                    <Menu.Item
                      key={d.id}
                      className={menuItemClass}
                      onClick={() => setActiveDegreeId(d.id)}
                    >
                      <Check
                        className={`size-3.5 shrink-0 ${d.id === activeDegree?.id ? "opacity-100" : "opacity-0"}`}
                      />
                      <span className="min-w-0 flex-1 truncate">{d.name}</span>
                    </Menu.Item>
                  ))}
                  <Menu.Separator className="bg-border my-1 h-px" />
                  <Menu.Item className={menuItemClass} onClick={() => setCarreraDialogOpen(true)}>
                    <Settings2 className="size-3.5 shrink-0" />
                    Gestionar carreras
                  </Menu.Item>
                </Menu.Popup>
              </Menu.Positioner>
            </Menu.Portal>
          </Menu.Root>
        </aside>

        {/* Materias cursadas */}
        <div className="min-w-0 flex-1">
          <SectionCard
            title="Materias cursadas"
            description="Tu historial académico: las materias que cursaste o estás cursando, con su cátedra y estado."
          >
            <div className="flex items-center justify-between">
              <span className={eyebrowClass}>Historial</span>
              <span className={eyebrowClass}>
                {visibleCursadas.length} {visibleCursadas.length === 1 ? "materia" : "materias"}
              </span>
            </div>

            {loadingData ? (
              <div className="text-muted-foreground flex items-center gap-2 py-4 text-sm">
                <Loader2 className="size-4 animate-spin" />
                Cargando materias…
              </div>
            ) : visibleCursadas.length === 0 ? (
              <p className="border-border bg-secondary/30 text-muted-foreground rounded-xl border border-dashed px-4 py-6 text-center text-sm">
                Todavía no agregaste materias.
              </p>
            ) : (
              <ul className="flex flex-col gap-2.5">
                {visibleCursadas.map((c) => {
                  const meta = [
                    c.department?.name,
                    c.period ? PERIOD_LABEL[c.period] : null,
                  ].filter(Boolean)
                  return (
                    <li
                      key={c.id}
                      className="border-border bg-secondary/40 group flex items-center gap-4 rounded-xl border px-4 py-3.5"
                    >
                      <BookOpen className="text-primary size-5 shrink-0" strokeWidth={1.5} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2.5">
                          <p className="text-foreground truncate font-medium">{c.subject.name}</p>
                          <span
                            className={`shrink-0 rounded-full border px-2 py-0.5 font-mono text-[0.6rem] font-medium tracking-wider uppercase ${STATUS_CLASS[c.status]}`}
                          >
                            {STATUS_LABEL[c.status]}
                          </span>
                        </div>
                        {meta.length > 0 && (
                          <p className={`mt-1 truncate ${eyebrowClass}`}>{meta.join(" · ")}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setCursadaToDelete(c)}
                        disabled={isPending}
                        aria-label={`Quitar ${c.subject.name}`}
                        className="text-muted-foreground hover:bg-destructive/15 hover:text-destructive flex size-7 shrink-0 items-center justify-center rounded-lg transition-colors disabled:opacity-40"
                      >
                        <X className="size-4" strokeWidth={1.5} />
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}

            <button
              type="button"
              onClick={() => setMateriaDialogOpen(true)}
              disabled={loadingData}
              className={`${pillButtonClass} self-end`}
            >
              <Plus className="size-4" strokeWidth={2} />
              Agregar
            </button>
          </SectionCard>
        </div>
      </div>

      {carreraDialog}

      {/* Confirmación: quitar materia */}
      <ConfirmDialog
        open={cursadaToDelete !== null}
        onOpenChange={(open) => !open && setCursadaToDelete(null)}
        title="Quitar materia"
        description={
          cursadaToDelete
            ? `¿Seguro que querés quitar "${cursadaToDelete.subject.name}" de tus cursadas?`
            : undefined
        }
        confirmLabel="Quitar"
        destructive
        onConfirm={() => {
          if (cursadaToDelete) handleDeleteCursada(cursadaToDelete.id, cursadaToDelete.subject.name)
        }}
      />

      {/* Diálogo: agregar materia */}
      <Dialog.Root open={materiaDialogOpen} onOpenChange={handleMateriaOpenChange}>
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
                options={subjects.map((s) => ({ value: String(s.id), label: s.name }))}
              />

              <Combobox
                label={
                  !subjectId
                    ? "Cátedra (elegí una materia primero)"
                    : availableDepts.length === 0
                      ? "Sin cátedras disponibles"
                      : "Cátedra (opcional)"
                }
                value={departmentId}
                onChange={setDepartmentId}
                options={availableDepts.map((d) => ({ value: String(d.id), label: d.name }))}
                disabled={!subjectId || availableDepts.length === 0}
              />

              <ToggleOptions
                size="sm"
                variant="outline"
                options={(Object.keys(STATUS_LABEL) as CursadaStatus[]).map((s) => ({
                  value: s,
                  label: STATUS_LABEL[s],
                }))}
                value={status}
                onChange={setStatus}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Dialog.Close className="text-muted-foreground hover:bg-secondary hover:text-foreground inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm transition-colors">
                Cancelar
              </Dialog.Close>
              <button
                type="button"
                onClick={handleAddCursada}
                disabled={!subjectId || isPending}
                className={pillButtonClass}
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
    </>
  )
}

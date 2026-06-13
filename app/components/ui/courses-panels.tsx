"use client"

import { useState, useEffect, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Dialog } from "@base-ui/react/dialog"
import { Plus, X, GraduationCap, Loader2 } from "lucide-react"
import { SectionCard, SelectInput } from "./settings-fields"
import { Toast } from "./toast"
import {
  getDegreesAction,
  joinDegreeAction,
  leaveDegreeAction,
} from "@/lib/api/actions/degree.actions"
import type { DegreeItem } from "@/lib/api/dtos/responses/degree"
import type { Me } from "@/lib/api/dtos/responses/me"

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

export function CarreraPanel({ me }: { me: Me }) {
  const toast = Toast.useToastManager()
  const router = useRouter()

  const [enrolledDegrees, setEnrolledDegrees] = useState<EnrolledDegree[]>(me.degrees)
  const [allDegrees, setAllDegrees] = useState<DegreeItem[]>([])
  const [loadingDegrees, setLoadingDegrees] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
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

  function handleOpenChange(open: boolean) {
    setDialogOpen(open)
    if (!open) {
      setSelectedDegreeId("")
      setSelectedYear("")
    }
  }

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
      handleOpenChange(false)
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
        {enrolledDegrees.length === 0 ? (
          <p className="border-border bg-secondary/30 text-muted-foreground rounded-xl border border-dashed px-4 py-6 text-center text-sm">
            Todavía no te anotaste en ninguna carrera.
          </p>
        ) : (
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

        <Dialog.Root open={dialogOpen} onOpenChange={handleOpenChange}>
          <Dialog.Trigger
            disabled={loadingDegrees}
            className="border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 inline-flex items-center justify-center gap-1.5 self-start rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus className="size-4" strokeWidth={2} />
            Agregar
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[1px] transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0" />
            <Dialog.Popup className="border-border bg-card fixed top-1/2 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 flex-col gap-5 rounded-2xl border p-6 shadow-lg transition-all duration-150 outline-none data-ending-style:scale-[0.97] data-ending-style:opacity-0 data-starting-style:scale-[0.97] data-starting-style:opacity-0">
              <div>
                <Dialog.Title className="text-foreground text-base font-semibold">
                  Anotarse en una carrera
                </Dialog.Title>
                <Dialog.Description className="text-muted-foreground mt-1 text-sm">
                  Seleccioná la carrera y el año en que estás cursando.
                </Dialog.Description>
              </div>

              <div className="flex flex-col gap-3">
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

                <SelectInput
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  disabled={!selectedDegreeId}
                >
                  <option value="">Año (opcional)</option>
                  {Object.entries(YEAR_LABELS).map(([val, label]) => (
                    <option key={val} value={val}>
                      {label}
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
                  onClick={handleJoinDegree}
                  disabled={!selectedDegreeId || degreesPending}
                  className="border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 inline-flex items-center justify-center gap-1.5 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {degreesPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Plus className="size-4" strokeWidth={2} />
                  )}
                  Anotarse
                </button>
              </div>
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </SectionCard>
  )
}

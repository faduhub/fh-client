"use client"

import type { SubjectItem } from "@/lib/api/dtos/responses/subject"
import { CursadaStatus } from "@/lib/api/dtos/responses/cursada"
import { Dialog } from "@base-ui/react"
import { Combobox } from "@/app/components/ui/combobox"
import type { DepartmentStats } from "@/lib/api/dtos/responses/department"
import { ToggleOptions } from "@/app/components/ui/toggle-options"
import { Loader2, Plus } from "lucide-react"

const STATUS_LABEL: Record<CursadaStatus, string> = {
  CURSANDO: "Cursando",
  REGULAR: "Regular",
  APROBADA: "Aprobada",
  ABANDONADA: "Abandonada",
}

const pillButtonClass =
  "border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 inline-flex items-center justify-center gap-1.5 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40"

type AddCursadaDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  subjectId: string
  departmentId: string
  status: CursadaStatus
  subjects: SubjectItem[]
  availableDepts: DepartmentStats[]
  pending: boolean
  onSubjectChange: (id: string) => void
  onDepartmentChange: (id: string) => void
  onStatusChange: (status: CursadaStatus) => void
  onAddCursada: () => void
}

export function AddCursadaDialog({
  open,
  onOpenChange,
  subjectId,
  departmentId,
  status,
  subjects,
  availableDepts,
  pending,
  onSubjectChange,
  onDepartmentChange,
  onStatusChange,
  onAddCursada,
}: AddCursadaDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
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
              onChange={onSubjectChange}
              options={subjects.map((subject) => ({
                value: String(subject.id),
                label: subject.name,
              }))}
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
              onChange={onDepartmentChange}
              options={availableDepts.map((department) => ({
                value: String(department.id),
                label: department.name,
              }))}
              disabled={!subjectId || availableDepts.length === 0}
            />

            <ToggleOptions
              size="sm"
              variant="outline"
              options={(Object.keys(STATUS_LABEL) as CursadaStatus[]).map((nextStatus) => ({
                value: nextStatus,
                label: STATUS_LABEL[nextStatus],
              }))}
              value={status}
              onChange={onStatusChange}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Dialog.Close className="text-muted-foreground hover:bg-secondary hover:text-foreground inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm transition-colors">
              Cancelar
            </Dialog.Close>
            <button
              type="button"
              onClick={onAddCursada}
              disabled={!subjectId || pending}
              className={pillButtonClass}
            >
              {pending ? (
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
  )
}

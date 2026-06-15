"use client"

import type { Cursada, CursadaStatus } from "@/lib/api/dtos/responses/cursada"
import { Dialog } from "@base-ui/react"
import { Combobox } from "@/app/components/ui/combobox"
import type { DepartmentStats } from "@/lib/api/dtos/responses/department"
import { ToggleOptions } from "@/app/components/ui/toggle-options"
import { Check, Loader2 } from "lucide-react"

const STATUS_LABEL: Record<CursadaStatus, string> = {
  CURSANDO: "Cursando",
  REGULAR: "Regular",
  APROBADA: "Aprobada",
  ABANDONADA: "Abandonada",
}

const pillButtonClass =
  "border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 inline-flex items-center justify-center gap-1.5 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40"

type EditCursadaDialogProps = {
  cursada: Cursada | null
  onOpenChange: (open: boolean) => void
  departmentId: string
  status: CursadaStatus
  availableDepts: DepartmentStats[]
  pending: boolean
  onDepartmentChange: (id: string) => void
  onStatusChange: (status: CursadaStatus) => void
  onEditCursada: () => void
}

export function EditCursadaDialog({
  cursada,
  onOpenChange,
  departmentId,
  status,
  availableDepts,
  pending,
  onDepartmentChange,
  onStatusChange,
  onEditCursada,
}: EditCursadaDialogProps) {
  return (
    <Dialog.Root open={cursada !== null} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[1px] transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Dialog.Popup className="border-border bg-card fixed top-1/2 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 flex-col gap-5 rounded-2xl border p-6 shadow-lg transition-all duration-150 outline-none data-ending-style:scale-[0.97] data-ending-style:opacity-0 data-starting-style:scale-[0.97] data-starting-style:opacity-0">
          <div>
            <Dialog.Title className="text-foreground text-base font-semibold">
              Editar materia
            </Dialog.Title>
            <Dialog.Description className="text-muted-foreground mt-1 text-sm">
              Actualizá la cátedra y el estado de tu cursada.
            </Dialog.Description>
          </div>

          <div className="flex flex-col gap-3">
            <div className="border-border bg-secondary/40 text-foreground rounded-xl border px-3 py-2.5 text-sm font-medium">
              {cursada?.subject.name}
            </div>

            <Combobox
              label={
                availableDepts.length === 0 ? "Sin cátedras disponibles" : "Cátedra (opcional)"
              }
              value={departmentId}
              onChange={onDepartmentChange}
              options={availableDepts.map((department) => ({
                value: String(department.id),
                label: department.name,
              }))}
              disabled={availableDepts.length === 0}
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
              onClick={onEditCursada}
              disabled={pending}
              className={pillButtonClass}
            >
              {pending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Check className="size-4" strokeWidth={2} />
              )}
              Guardar
            </button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

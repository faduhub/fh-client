import { Dialog } from "@base-ui/react/dialog"
import { SelectInput } from "@/app/components/ui/select-input"

type EnrolledDegree = Me["degrees"][number]

import type { DegreeItem } from "@/lib/api/dtos/responses/degree"
import { Me } from "@/lib/api/dtos/responses/me"
import { Loader2, Plus, X } from "lucide-react"

const eyebrowClass = "text-muted-foreground font-mono text-[0.7rem] tracking-widest uppercase"

type CarreraDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  enrolledDegrees: EnrolledDegree[]
  availableToJoin: DegreeItem[]
  selectedDegreeId: string
  onSelectedDegreeIdChange: (value: string) => void
  pending: boolean
  onJoinDegree: () => void
  onLeaveDegree: (degree: EnrolledDegree) => void
}

const pillButtonClass =
  "border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 inline-flex items-center justify-center gap-1.5 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40"

export function CarreraDialog({
  open,
  onOpenChange,
  enrolledDegrees,
  availableToJoin,
  selectedDegreeId,
  onSelectedDegreeIdChange,
  pending,
  onJoinDegree,
  onLeaveDegree,
}: CarreraDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
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
              {enrolledDegrees.map((degree) => (
                <li
                  key={degree.id}
                  className="border-border bg-secondary/40 flex items-center gap-3 rounded-xl border px-4 py-3"
                >
                  <div className="min-w-0 flex-1 leading-tight">
                    <p className="text-foreground truncate text-sm font-medium">{degree.name}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onLeaveDegree(degree)}
                    disabled={pending}
                    aria-label={`Salir de ${degree.name}`}
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
              onChange={(event) => onSelectedDegreeIdChange(event.target.value)}
            >
              <option value="">Seleccioná una carrera</option>
              {availableToJoin.map((degree) => (
                <option key={degree.id} value={String(degree.id)}>
                  {degree.name}
                </option>
              ))}
            </SelectInput>

            <button
              type="button"
              onClick={onJoinDegree}
              disabled={!selectedDegreeId || pending}
              className={`${pillButtonClass} self-start`}
            >
              {pending ? (
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
}

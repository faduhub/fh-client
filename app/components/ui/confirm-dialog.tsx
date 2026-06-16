"use client"

import { AlertDialog } from "@base-ui/react/alert-dialog"
import { Button } from "@/app/components/ui/button"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
  onConfirm: () => void
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  destructive = false,
  onConfirm,
}: Props) {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Backdrop className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[1px] transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <AlertDialog.Popup className="border-border bg-card fixed top-1/2 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 flex-col gap-2 rounded-lg border p-6 shadow-lg transition-all duration-150 outline-none data-ending-style:scale-[0.97] data-ending-style:opacity-0 data-starting-style:scale-[0.97] data-starting-style:opacity-0">
          <AlertDialog.Title className="text-foreground text-base font-semibold">
            {title}
          </AlertDialog.Title>
          {description && (
            <AlertDialog.Description className="text-muted-foreground text-sm leading-relaxed">
              {description}
            </AlertDialog.Description>
          )}
          <div className="mt-4 flex justify-end gap-2">
            <AlertDialog.Close render={<Button variant="ghost" />}>{cancelLabel}</AlertDialog.Close>
            <Button
              variant={destructive ? "destructive" : "default"}
              onClick={() => {
                onConfirm()
                onOpenChange(false)
              }}
            >
              {confirmLabel}
            </Button>
          </div>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}

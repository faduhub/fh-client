"use client"

import { useState } from "react"
import { Menu } from "@base-ui/react/menu"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { ConfirmDialog } from "@/app/components/ui/confirm-dialog"

const popupClass =
  "min-w-40 overflow-hidden rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-md data-entering:animate-in data-entering:fade-in-50 data-entering:zoom-in-95"
const menuItemClass =
  "flex w-full cursor-default items-center gap-2 rounded-lg px-2.5 py-2 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground"

type Props = {
  reviewId: string
  subject: string
}

export function OwnerMenu({ reviewId, subject }: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false)

  function handleEdit() {
    // TODO: cablear con la API de editar review (todavía no existe).
    console.log("editar review", reviewId)
  }

  function handleDelete() {
    // TODO: cablear con la API de borrar review (todavía no existe).
    console.log("borrar review", reviewId)
  }

  return (
    <>
      <Menu.Root>
        <Menu.Trigger
          aria-label="Opciones de la experiencia"
          className="text-muted-foreground hover:border-foreground/40 hover:text-foreground relative z-10 inline-flex size-8 items-center justify-center rounded-full border border-transparent transition-colors"
        >
          <MoreHorizontal className="size-4" />
        </Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner side="bottom" align="end" sideOffset={6} className="z-50">
            <Menu.Popup className={popupClass}>
              <Menu.Item className={menuItemClass} onClick={handleEdit}>
                <Pencil className="size-3.5 shrink-0" />
                Editar
              </Menu.Item>
              <Menu.Item
                className={`${menuItemClass} text-destructive data-highlighted:bg-destructive data-highlighted:text-destructive-foreground`}
                onClick={() => setConfirmOpen(true)}
              >
                <Trash2 className="size-3.5 shrink-0" />
                Eliminar
              </Menu.Item>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Eliminar experiencia"
        description={`¿Seguro que querés eliminar tu experiencia sobre "${subject}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        destructive
        onConfirm={handleDelete}
      />
    </>
  )
}

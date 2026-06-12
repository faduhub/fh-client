"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { MoreHorizontal } from "lucide-react"
import type { Post } from "@/lib/api/dtos/responses/post"
import { editPostAction, deletePostAction } from "@/lib/api/actions/post.actions"
import { Button } from "@/app/components/ui/button"
import { Textarea } from "@/app/components/ui/textarea"
import { ConfirmDialog } from "@/app/components/ui/confirm-dialog"
import { Toast } from "@/app/components/ui/toast"
import AppMenu from "@/app/components/ui/menu"

type Props = {
  post: Post
  onUpdate: (updated: Post) => void
}

export function PostActions({ post, onUpdate }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [body, setBody] = useState(post.body)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [, startTransition] = useTransition()
  const toast = Toast.useToastManager()
  const router = useRouter()

  function saveEdit() {
    const text = body.trim()
    if (!text || text === post.body) {
      setIsEditing(false)
      return
    }
    startTransition(async () => {
      const res = await editPostAction(post.id, { body: text })
      if (res.success) {
        onUpdate(res.data)
        toast.add({ title: "Post editado", type: "success" })
      } else {
        toast.add({ title: "Error", description: res.error, type: "error" })
      }
      setIsEditing(false)
    })
  }

  function handleDelete() {
    startTransition(async () => {
      const res = await deletePostAction(post.id)
      if (res.success) {
        toast.add({ title: "Post eliminado", type: "success" })
        router.push("/muros")
      } else {
        toast.add({ title: "Error", description: res.error, type: "error" })
      }
    })
  }

  if (isEditing) {
    return (
      <div className="flex flex-col gap-3">
        <Textarea value={body} onValueChange={setBody} autoFocus />
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={saveEdit} disabled={body.trim() === ""}>
            Guardar
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setBody(post.body)
              setIsEditing(false)
            }}
          >
            Cancelar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <AppMenu
        trigger={
          <span
            className="text-muted-foreground hover:text-foreground hover:bg-muted inline-flex size-8 items-center justify-center rounded-full transition-colors"
            aria-label="Más opciones del post"
          >
            <MoreHorizontal className="size-4" />
          </span>
        }
        options={[
          { label: "Editar", onClick: () => setIsEditing(true) },
          {
            label: "Borrar",
            onClick: () => setConfirmOpen(true),
            separator: true,
            destructive: true,
          },
        ]}
      />
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="¿Borrar post?"
        description="Esta acción no se puede deshacer. El post se eliminará permanentemente."
        confirmLabel="Borrar"
        destructive
        onConfirm={handleDelete}
      />
    </>
  )
}

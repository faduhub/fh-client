import { useState, useTransition } from "react"
import type { Comment } from "@/lib/api/dtos/responses/comment"
import {
  createCommentAction,
  deleteCommentAction,
  updateCommentAction,
} from "@/lib/api/actions/comment.actions"
import { Toast } from "@/app/components/ui/toast"

function draft(body: string, parentId: string | null): Comment {
  return {
    id: crypto.randomUUID(),
    author: "Vos",
    authorSlug: "vos",
    initials: "VO",
    date: "Recién",
    body,
    edited: false,
    deleted: false,
    likes: 0,
    likedByMe: false,
    repliesCount: 0,
    parentId,
  }
}

/**
 * Maneja una lista de comentarios con updates optimistas + rollback y toasts.
 * Sirve tanto para los top-level (en la sección) como para las replies de un
 * comment (en la card), porque ambas son `Comment[]`.
 */
export function useCommentList(reviewId: string, initial: Comment[]) {
  const [comments, setComments] = useState<Comment[]>(initial)
  const [isPending, startTransition] = useTransition()
  const toast = Toast.useToastManager()

  function add(text: string, parentId: string | null = null) {
    const optimistic = draft(text, parentId)
    // top-level: arriba (feedback inmediato); reply: al final (orden cronológico).
    setComments((prev) => (parentId ? [...prev, optimistic] : [optimistic, ...prev]))

    startTransition(async () => {
      const res = await createCommentAction({
        sourceType: "REVIEW",
        sourceId: reviewId,
        body: text,
        ...(parentId ? { parentId } : {}),
      })
      if (res.success) {
        toast.add({ title: parentId ? "Respuesta publicada" : "Comentario publicado", type: "success" })
      } else {
        setComments((prev) => prev.filter((c) => c.id !== optimistic.id))
        toast.add({ title: "Error", description: res.error, type: "error" })
      }
    })
  }

  function remove(comment: Comment) {
    const snapshot = comments
    // Soft delete: si tiene replies se conserva como "[eliminado]"; si no, se saca.
    setComments((prev) =>
      prev.flatMap((c) =>
        c.id !== comment.id ? [c] : c.repliesCount > 0 ? [{ ...c, deleted: true, body: "[eliminado]" }] : [],
      ),
    )

    startTransition(async () => {
      const res = await deleteCommentAction(comment.id)
      if (res.success) {
        toast.add({ title: "Comentario eliminado", type: "success" })
      } else {
        setComments(snapshot)
        toast.add({ title: "Error", description: res.error, type: "error" })
      }
    })
  }

  function edit(id: string, body: string) {
    const snapshot = comments
    setComments((prev) => prev.map((c) => (c.id === id ? { ...c, body, edited: true } : c)))

    startTransition(async () => {
      const res = await updateCommentAction(id, body)
      if (res.success) {
        toast.add({ title: "Comentario editado", type: "success" })
      } else {
        setComments(snapshot)
        toast.add({ title: "Error", description: res.error, type: "error" })
      }
    })
  }

  function replace(list: Comment[]) {
    setComments(list)
  }

  return { comments, isPending, add, remove, edit, replace }
}

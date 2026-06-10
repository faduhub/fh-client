"use client"

import { useState } from "react"
import type { Comment } from "@/lib/api/dtos/responses/comment"
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar"
import { Button } from "@/app/components/ui/button"
import { Textarea } from "@/app/components/ui/textarea"
import { Toast } from "@/app/components/ui/toast"
import { CommentCard } from "@/app/components/comment-card"

export function CommentSection({ initialComments = [] }: { initialComments?: Comment[] }) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [body, setBody] = useState("")
  const toast = Toast.useToastManager()

  function addComment() {
    const text = body.trim()
    if (!text) return

    try {
      setComments((prev) => [
        {
          id: crypto.randomUUID(),
          author: "Vos",
          authorSlug: "vos",
          initials: "VO",
          date: "Recién",
          body: text,
          likes: 0,
        },
        ...prev,
      ])
      setBody("")
      toast.add({ title: "Comentario publicado", type: "success" })
    } catch {
      toast.add({
        title: "Error",
        description: "No se pudo publicar el comentario.",
        type: "error",
      })
    }
  }

  function deleteComment(id: string) {
    try {
      setComments((prev) => prev.filter((c) => c.id !== id))
      toast.add({ title: "Comentario eliminado", type: "success" })
    } catch {
      toast.add({
        title: "Error",
        description: "No se pudo eliminar el comentario.",
        type: "error",
      })
    }
  }

  function editComment(id: string, body: string) {
    setComments((prev) => prev.map((c) => (c.id === id ? { ...c, body, edited: true } : c)))
  }

  return (
    <section id="comentarios" className="flex flex-col gap-6">
      <h2 className="text-foreground text-lg font-semibold tracking-tight">
        Comentarios <span className="text-muted-foreground font-normal">({comments.length})</span>
      </h2>

      {/* Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          addComment()
        }}
        className="border-border bg-card flex gap-3 rounded-md border p-4"
      >
        <Avatar className="size-8 shrink-0">
          <AvatarFallback className="bg-secondary text-secondary-foreground text-xs font-medium">
            VO
          </AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <Textarea
            value={body}
            onValueChange={setBody}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                e.preventDefault()
                addComment()
              }
            }}
            placeholder="Dejá tu comentario..."
          />
          <div className="flex items-center justify-between gap-3">
            <span className="text-muted-foreground text-xs">⌘ + Enter para enviar</span>
            <Button type="submit" disabled={body.trim() === ""}>
              Comentar
            </Button>
          </div>
        </div>
      </form>

      {/* Lista de comentarios */}
      {comments.length > 0 ? (
        <ul className="flex flex-col gap-3">
          {comments.map((c) => (
            <CommentCard
              key={c.id}
              comment={c}
              onEdit={editComment}
              onDelete={(comment) => deleteComment(comment.id)}
            />
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground rounded-md border border-dashed py-10 text-center text-sm">
          Todavía no hay comentarios. Sé el primero en dejar uno.
        </p>
      )}
    </section>
  )
}

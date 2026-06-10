"use client"

import { useState } from "react"
import Link from "next/link"
import { MoreHorizontal, ThumbsUp } from "lucide-react"
import type { Comment } from "@/lib/api/dtos/responses/comment"
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar"
import { Button } from "@/app/components/ui/button"
import { Textarea } from "@/app/components/ui/textarea"
import { ConfirmDialog } from "@/app/components/ui/confirm-dialog"
import AppMenu from "@/app/components/ui/menu"
import { cn } from "@/lib/utils"

type Props = {
  comment: Comment
  onEdit?: (id: string, body: string) => void
  onReport?: (comment: Comment) => void
  onDelete?: (comment: Comment) => void
}

export function CommentCard({ comment, onEdit, onReport, onDelete }: Props) {
  const [likes, setLikes] = useState(comment.likes)
  const [liked, setLiked] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(comment.body)
  const [confirmOpen, setConfirmOpen] = useState(false)

  function toggleLike() {
    setLikes((n) => (liked ? n - 1 : n + 1))
    setLiked((v) => !v)
  }

  function startEditing() {
    setDraft(comment.body)
    setIsEditing(true)
  }

  function saveEdit() {
    const text = draft.trim()
    if (text && text !== comment.body) onEdit?.(comment.id, text)
    setIsEditing(false)
  }

  return (
    <li className="border-border bg-card flex items-start gap-3 rounded-md border p-4">
      <Avatar className="size-8 shrink-0">
        <AvatarFallback className="bg-secondary text-secondary-foreground text-xs font-medium">
          {comment.initials}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <Link
              href={`/usuario/${comment.authorSlug}`}
              className="text-foreground hover:text-accent text-sm font-medium transition-colors"
            >
              {comment.author}
            </Link>
            <span className="text-muted-foreground text-xs">
              {comment.date}
              {comment.edited && <span className="italic"> · editado</span>}
            </span>
          </div>

          <AppMenu
            trigger={
              <span
                className="text-muted-foreground hover:text-foreground hover:bg-muted -mr-1 inline-flex size-7 items-center justify-center rounded-full transition-colors"
                aria-label="Más opciones"
              >
                <MoreHorizontal className="size-4" />
              </span>
            }
            options={[
              { label: "Editar", onClick: startEditing },
              { label: "Reportar", onClick: () => onReport?.(comment), destructive: true },
              {
                label: "Borrar",
                onClick: () => setConfirmOpen(true),
                separator: true,
                destructive: true,
              },
            ]}
          />
        </div>

        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          title="¿Borrar comentario?"
          description="Esta acción no se puede deshacer. El comentario se eliminará de forma permanente."
          confirmLabel="Borrar"
          destructive
          onConfirm={() => onDelete?.(comment)}
        />

        {isEditing ? (
          <div className="mt-2 flex flex-col gap-2">
            <Textarea
              value={draft}
              onValueChange={setDraft}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                  e.preventDefault()
                  saveEdit()
                } else if (e.key === "Escape") {
                  setIsEditing(false)
                }
              }}
              autoFocus
            />
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={saveEdit} disabled={draft.trim() === ""}>
                Guardar
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-foreground/90 mt-1.5 text-sm leading-relaxed text-pretty">
            {comment.body}
          </p>
        )}

        <div className="mt-3">
          <button
            onClick={toggleLike}
            aria-pressed={liked}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
              liked
                ? "border-accent bg-accent text-accent-foreground"
                : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground",
            )}
          >
            <ThumbsUp className="size-3.5" />
            {likes}
          </button>
        </div>
      </div>
    </li>
  )
}

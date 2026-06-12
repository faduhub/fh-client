"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { MessageSquare, MoreHorizontal, ThumbsUp } from "lucide-react"
import type { Comment } from "@/lib/api/dtos/responses/comment"
import type { CommentSource } from "@/lib/hooks/use-comment-list"
import {
  getRepliesAction,
  likeCommentAction,
  unlikeCommentAction,
} from "@/lib/api/actions/comment.actions"
import { useCommentList } from "@/lib/hooks/use-comment-list"
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar"
import { Button } from "@/app/components/ui/button"
import { Textarea } from "@/app/components/ui/textarea"
import { ConfirmDialog } from "@/app/components/ui/confirm-dialog"
import { Toast } from "@/app/components/ui/toast"
import { CommentComposer } from "@/app/components/comment-composer"
import AppMenu from "@/app/components/ui/menu"
import { cn } from "@/lib/utils"

type Props = {
  comment: Comment
  source: CommentSource
  /** Una reply no puede tener su propia reply (cap de un nivel). */
  isReply?: boolean
  onEdit?: (id: string, body: string) => void
  onReport?: (comment: Comment) => void
  onDelete?: (comment: Comment) => void
}

export function CommentCard({
  comment,
  source,
  isReply = false,
  onEdit,
  onReport,
  onDelete,
}: Props) {
  const [likes, setLikes] = useState(comment.likes)
  const [liked, setLiked] = useState(comment.likedByMe)
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(comment.body)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [, startTransition] = useTransition()
  const toast = Toast.useToastManager()

  const replies = useCommentList(source, [])
  const [loaded, setLoaded] = useState(false)
  const [loadingReplies, setLoadingReplies] = useState(false)
  const [showReplies, setShowReplies] = useState(false)
  const [replyOpen, setReplyOpen] = useState(false)
  const repliesCount = loaded ? replies.comments.length : comment.repliesCount

  const isDeleted = comment.deleted

  function toggleLike() {
    const next = !liked
    setLiked(next)
    setLikes((n) => n + (next ? 1 : -1))
    startTransition(async () => {
      const res = next ? await likeCommentAction(comment.id) : await unlikeCommentAction(comment.id)
      if (!res.success) {
        setLiked(!next)
        setLikes((n) => n + (next ? -1 : 1))
        toast.add({ title: "Error", description: res.error, type: "error" })
      }
    })
  }

  function saveEdit() {
    const text = draft.trim()
    if (text && text !== comment.body) onEdit?.(comment.id, text)
    setIsEditing(false)
  }

  async function ensureLoaded(): Promise<boolean> {
    if (loaded) return true
    if (comment.repliesCount === 0) {
      setLoaded(true)
      return true
    }
    setLoadingReplies(true)
    const res = await getRepliesAction(comment.id)
    setLoadingReplies(false)
    if (res.success) {
      replies.replace(res.data)
      setLoaded(true)
      return true
    }
    toast.add({ title: "Error", description: res.error, type: "error" })
    return false
  }

  async function toggleReplies() {
    if (showReplies) {
      setShowReplies(false)
      return
    }
    if (await ensureLoaded()) setShowReplies(true)
  }

  async function openReply() {
    await ensureLoaded()
    setShowReplies(true)
    setReplyOpen(true)
  }

  function submitReply(text: string) {
    replies.add(text, comment.id)
    setReplyOpen(false)
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
            {isDeleted ? (
              <span className="text-muted-foreground text-sm font-medium">[eliminado]</span>
            ) : (
              <Link
                href={`/usuario/${comment.authorSlug}`}
                className="text-foreground hover:text-accent text-sm font-medium transition-colors"
              >
                {comment.author}
              </Link>
            )}
            <span className="text-muted-foreground text-xs">
              {comment.date}
              {comment.edited && <span className="italic"> · editado</span>}
            </span>
          </div>

          {!isDeleted && (
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
                { label: "Editar", onClick: () => setIsEditing(true) },
                { label: "Reportar", onClick: () => onReport?.(comment), destructive: true },
                {
                  label: "Borrar",
                  onClick: () => setConfirmOpen(true),
                  separator: true,
                  destructive: true,
                },
              ]}
            />
          )}
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
          <p
            className={cn(
              "mt-1.5 text-sm leading-relaxed text-pretty",
              isDeleted ? "text-muted-foreground italic" : "text-foreground/90",
            )}
          >
            {comment.body}
          </p>
        )}

        {(!isDeleted || (!isReply && repliesCount > 0)) && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {!isDeleted && (
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
            )}

            {!isDeleted && !isReply && (
              <button
                onClick={openReply}
                className="text-muted-foreground hover:border-foreground/40 hover:text-foreground border-border inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors"
              >
                <MessageSquare className="size-3.5" />
                Responder
              </button>
            )}

            {!isReply && repliesCount > 0 && (
              <button
                onClick={toggleReplies}
                disabled={loadingReplies}
                className="text-accent ml-1 text-xs font-medium hover:underline disabled:opacity-60"
              >
                {loadingReplies
                  ? "Cargando..."
                  : showReplies
                    ? "Ocultar respuestas"
                    : `Ver ${repliesCount} ${repliesCount === 1 ? "respuesta" : "respuestas"}`}
              </button>
            )}
          </div>
        )}

        {replyOpen && !isReply && !isDeleted && (
          <div className="mt-3">
            <CommentComposer
              compact
              autoFocus
              placeholder="Escribí una respuesta..."
              submitLabel="Responder"
              onSubmit={submitReply}
              onCancel={() => setReplyOpen(false)}
            />
          </div>
        )}

        {showReplies && !isReply && (
          <ul className="border-border mt-3 flex flex-col gap-3 border-l pl-4">
            {replies.comments.map((r) => (
              <CommentCard
                key={r.id}
                comment={r}
                source={source}
                isReply
                onEdit={replies.edit}
                onReport={onReport}
                onDelete={replies.remove}
              />
            ))}
          </ul>
        )}
      </div>
    </li>
  )
}

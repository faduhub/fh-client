"use client"

import { useState } from "react"
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar"
import { Button } from "@/app/components/ui/button"
import { Textarea } from "@/app/components/ui/textarea"

type Props = {
  onSubmit: (text: string) => void
  onCancel?: () => void
  placeholder?: string
  submitLabel?: string
  autoFocus?: boolean
  pending?: boolean
  /** Variante reducida (sin avatar) para el composer de respuestas. */
  compact?: boolean
}

export function CommentComposer({
  onSubmit,
  onCancel,
  placeholder = "Dejá tu comentario...",
  submitLabel = "Comentar",
  autoFocus = false,
  pending = false,
  compact = false,
}: Props) {
  const [body, setBody] = useState("")

  function submit() {
    const text = body.trim()
    if (!text) return
    onSubmit(text)
    setBody("")
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
      className="border-border bg-card flex gap-3 rounded-md border p-4"
    >
      {!compact && (
        <Avatar className="size-8 shrink-0">
          <AvatarFallback className="bg-secondary text-secondary-foreground text-xs font-medium">
            VO
          </AvatarFallback>
        </Avatar>
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <Textarea
          value={body}
          onValueChange={setBody}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
              e.preventDefault()
              submit()
            } else if (e.key === "Escape") {
              onCancel?.()
            }
          }}
          placeholder={placeholder}
          autoFocus={autoFocus}
        />
        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground text-xs">⌘ + Enter para enviar</span>
          <div className="flex gap-2">
            {onCancel && (
              <Button type="button" variant="ghost" onClick={onCancel}>
                Cancelar
              </Button>
            )}
            <Button type="submit" disabled={body.trim() === "" || pending}>
              {pending ? "Enviando..." : submitLabel}
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}

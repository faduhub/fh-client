"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import type { BoardType } from "@/lib/api/dtos/responses/post"
import type { DegreeItem } from "@/lib/api/dtos/responses/degree"
import type { SubjectItem } from "@/lib/api/dtos/responses/subject"
import type { DepartmentStats } from "@/lib/api/dtos/responses/department"
import { createPostAction } from "@/lib/api/actions/post.actions"
import { Button } from "@/app/components/ui/button"
import { Textarea } from "@/app/components/ui/textarea"
import { Toast } from "@/app/components/ui/toast"
import { cn } from "@/lib/utils"

type Props = {
  degrees: DegreeItem[]
  subjects: SubjectItem[]
  departments: DepartmentStats[]
  initialBoardType?: BoardType
  initialBoardId?: string
}

const boardTypes: { value: BoardType; label: string }[] = [
  { value: "GENERAL", label: "General" },
  { value: "CARRERA", label: "Carrera" },
  { value: "MATERIA", label: "Materia" },
  { value: "CATEDRA", label: "Cátedra" },
]

export function PostForm({
  degrees,
  subjects,
  departments,
  initialBoardType = "GENERAL",
  initialBoardId = "",
}: Props) {
  const [boardType, setBoardType] = useState<BoardType>(initialBoardType)
  const [boardId, setBoardId] = useState(initialBoardId)
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [, startTransition] = useTransition()
  const toast = Toast.useToastManager()
  const router = useRouter()

  function handleBoardTypeChange(type: BoardType) {
    setBoardType(type)
    setBoardId("")
  }

  const entityOptions = () => {
    if (boardType === "CARRERA") return degrees.map((d) => ({ id: String(d.id), label: d.name }))
    if (boardType === "MATERIA") return subjects.map((s) => ({ id: String(s.id), label: s.name }))
    if (boardType === "CATEDRA") return departments.map((d) => ({ id: d.id, label: d.name }))
    return []
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const bodyText = body.trim()
    if (!bodyText) return

    startTransition(async () => {
      const res = await createPostAction({
        boardType,
        ...(boardType !== "GENERAL" && boardId ? { boardId } : {}),
        title: title.trim() || undefined,
        body: bodyText,
      })
      if (res.success) {
        toast.add({ title: "Post publicado", type: "success" })
        router.push(`/muros/${res.data.id}`)
      } else {
        toast.add({ title: "Error", description: res.error, type: "error" })
      }
    })
  }

  const options = entityOptions()

  return (
    <form
      onSubmit={handleSubmit}
      className="border-border bg-card flex flex-col gap-6 rounded-md border p-6"
    >
      {/* Board type */}
      <div className="flex flex-col gap-2">
        <label className="text-foreground text-sm font-medium">Muro</label>
        <div className="flex flex-wrap gap-2">
          {boardTypes.map((bt) => (
            <button
              key={bt.value}
              type="button"
              onClick={() => handleBoardTypeChange(bt.value)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                boardType === bt.value
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground",
              )}
            >
              {bt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Entity selector */}
      {boardType !== "GENERAL" && options.length > 0 && (
        <div className="flex flex-col gap-2">
          <label className="text-foreground text-sm font-medium">
            {boardType === "CARRERA" ? "Carrera" : boardType === "MATERIA" ? "Materia" : "Cátedra"}
          </label>
          <select
            value={boardId}
            onChange={(e) => setBoardId(e.target.value)}
            required
            className="border-border bg-card text-foreground rounded-md border px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-current"
          >
            <option value="" disabled>
              Seleccioná una opción...
            </option>
            {options.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Title */}
      <div className="flex flex-col gap-2">
        <label className="text-foreground text-sm font-medium">
          Título <span className="text-muted-foreground font-normal">(opcional)</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
          placeholder="Un título para tu post..."
          className="border-border bg-card text-foreground placeholder:text-muted-foreground rounded-md border px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-current"
        />
      </div>

      {/* Body */}
      <div className="flex flex-col gap-2">
        <label className="text-foreground text-sm font-medium">
          Contenido <span className="text-destructive">*</span>
        </label>
        <Textarea
          value={body}
          onValueChange={setBody}
          placeholder="Escribí tu post..."
          maxLength={5000}
        />
        <p className="text-muted-foreground text-right text-xs">{body.length}/5000</p>
      </div>

      <div className="flex items-center justify-end gap-3">
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={body.trim() === "" || (boardType !== "GENERAL" && !boardId)}
        >
          Publicar
        </Button>
      </div>
    </form>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Star, Check, X } from "lucide-react"
import type { DepartmentStats } from "@/lib/api/dtos/responses/department"
import type { SubjectItem } from "@/lib/api/dtos/responses/subject"
import type { TagItem } from "@/lib/api/dtos/responses/tag"
import type { DegreeItem } from "@/lib/api/dtos/responses/degree"
import { createReviewAction } from "@/lib/api/actions/review.actions"
import { useSession } from "@/lib/auth-client"
import { Toast } from "@/app/components/ui/toast"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { cn } from "@/lib/utils"

function BarPicker({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
        {label}
      </span>
      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i)}
            className={cn(
              "h-6 flex-1 rounded-sm transition-colors",
              i <= value ? "bg-foreground" : "bg-border hover:bg-foreground/30",
            )}
            aria-label={`${i} de 5`}
          />
        ))}
        <span className="text-muted-foreground ml-1 w-4 font-mono text-xs">{value}</span>
      </div>
    </div>
  )
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(0)}
          aria-label={`${i} estrellas`}
        >
          <Star
            className={cn(
              "size-7 transition-colors",
              i <= (hovered || value) ? "fill-accent text-accent" : "text-border fill-transparent",
            )}
          />
        </button>
      ))}
    </div>
  )
}

export function ReviewForm({
  departments,
  subjects,
  tags,
  degrees,
}: {
  departments: DepartmentStats[]
  subjects: SubjectItem[]
  tags: TagItem[]
  degrees: DegreeItem[]
}) {
  const router = useRouter()
  const { data: session, isPending } = useSession()

  useEffect(() => {
    if (!isPending && !session) router.replace("/login")
  }, [session, isPending, router])

  const [catedraSlug, setCatedraSlug] = useState("")
  const [departmentId, setDepartmentId] = useState<string | null>(null)
  const [subjectId, setSubjectId] = useState<string | null>(null)
  const [degreeId, setDegreeId] = useState<string | null>(null)
  const [rating, setRating] = useState(0)
  const [workload, setWorkload] = useState(3)
  const [difficulty, setDifficulty] = useState(3)
  const [recommends, setRecommends] = useState<boolean | null>(null)
  const [body, setBody] = useState("")
  const [year, setYear] = useState(new Date().getFullYear())
  const [period, setPeriod] = useState<"FIRST" | "SECOND" | "SUMMER">("FIRST")
  const [tagIds, setTagIds] = useState<number[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const toastManager = Toast.useToastManager()

  function toggleTag(id: number) {
    setTagIds((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!catedraSlug) return setError("Seleccioná una cátedra")
    if (!departmentId)
      return setError("No se pudo resolver el ID de la cátedra — reiniciá el servidor")
    if (!subjectId) return setError("Seleccioná una materia")
    if (!degreeId) return setError("Seleccioná una carrera")
    if (rating === 0) return setError("Seleccioná una calificación")
    if (recommends === null) return setError("Indicá si recomendás la cátedra")
    if (!body.trim()) return setError("Escribí una experiencia")

    setLoading(true)
    const result = await createReviewAction({
      departmentId,
      subjectId,
      degreeId,
      rating,
      workload,
      difficulty,
      recommends,
      body: body.trim(),
      year,
      period,
      tagIds,
    })
    setLoading(false)

    if (!result.success) {
      toastManager.add({
        title: "Error",
        description: result.error ?? "Error al crear la experiencia",
        type: "error",
      })
      setError(result.error ?? "Error al crear la experiencia")
      return
    }

    toastManager.add({
      title: "Experiencia publicada",
      description: "¡Gracias por tu aporte!",
      type: "success",
    })
    router.push("/")
    router.refresh()
  }

  const currentYear = new Date().getFullYear()

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {/* Cátedra, materia y carrera */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
            Cátedra <span className="text-destructive">*</span>
          </label>
          <select
            value={catedraSlug}
            onChange={(e) => {
              const slug = e.target.value
              setCatedraSlug(slug)
              const found = departments.find((c) => c.slug === slug)
              setDepartmentId(found?.id ?? null)
            }}
            className="border-input focus:border-ring h-10 w-full rounded-md border bg-transparent px-3 text-sm outline-none"
          >
            <option value="">Seleccioná una cátedra</option>
            {departments.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
            Materia <span className="text-destructive">*</span>
          </label>
          <select
            value={subjectId ?? ""}
            onChange={(e) => setSubjectId(e.target.value ? e.target.value : null)}
            className="border-input focus:border-ring h-10 w-full rounded-md border bg-transparent px-3 text-sm outline-none"
          >
            <option value="">Seleccioná una materia</option>
            {subjects.map((m) => (
              <option key={m.slug} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
            Carrera <span className="text-destructive">*</span>
          </label>
          <select
            value={degreeId ?? ""}
            onChange={(e) => setDegreeId(e.target.value ? e.target.value : null)}
            className="border-input focus:border-ring h-10 w-full rounded-md border bg-transparent px-3 text-sm outline-none"
          >
            <option value="">Seleccioná una carrera</option>
            {degrees.map((c) => (
              <option key={c.slug} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Calificación */}
      <div className="flex flex-col gap-3">
        <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
          Calificación general <span className="text-destructive">*</span>
        </span>
        <StarPicker value={rating} onChange={setRating} />
      </div>

      {/* Métricas */}
      <div className="grid gap-6 sm:grid-cols-2">
        <BarPicker label="Carga horaria" value={workload} onChange={setWorkload} />
        <BarPicker label="Dificultad" value={difficulty} onChange={setDifficulty} />
      </div>

      {/* Recomienda */}
      <div className="flex flex-col gap-3">
        <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
          ¿Recomendás la cátedra? <span className="text-destructive">*</span>
        </span>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setRecommends(true)}
            className={cn(
              "inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors",
              recommends === true
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:border-foreground/50 hover:text-foreground",
            )}
          >
            <Check className="size-4" />
            Sí
          </button>
          <button
            type="button"
            onClick={() => setRecommends(false)}
            className={cn(
              "inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors",
              recommends === false
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:border-foreground/50 hover:text-foreground",
            )}
          >
            <X className="size-4" />
            No
          </button>
        </div>
      </div>

      {/* Texto */}
      <div className="flex flex-col gap-2">
        <label className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
          Experiencia <span className="text-destructive">*</span>
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Contá tu experiencia con la cátedra..."
          rows={5}
          className="border-input focus:border-ring placeholder:text-muted-foreground w-full resize-none rounded-md border bg-transparent px-3 py-2 text-sm outline-none"
        />
      </div>

      {/* Año y período */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
            Año cursado
          </label>
          <Input
            type="number"
            min={2000}
            max={currentYear}
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="h-10"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
            Período
          </label>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as typeof period)}
            className="border-input focus:border-ring h-10 w-full rounded-md border bg-transparent px-3 text-sm outline-none"
          >
            <option value="FIRST">Primer cuatrimestre</option>
            <option value="SECOND">Segundo cuatrimestre</option>
            <option value="SUMMER">Verano</option>
          </select>
        </div>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-col gap-3">
          <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
            Tags
          </span>
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => toggleTag(t.id)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  tagIds.includes(t.id)
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-muted-foreground hover:border-foreground/50 hover:text-foreground",
                )}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && <p className="text-destructive text-sm">{error}</p>}

      <div className="border-border flex items-center gap-4 border-t pt-6">
        <Button type="submit" disabled={loading} className="px-8">
          {loading ? "Publicando..." : "Publicar experiencia"}
        </Button>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}

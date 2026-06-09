"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Star, Check, X } from "lucide-react"
import type { CatedraStats, MateriaItem, TagItem, CarreraItem } from "@/lib/api"
import { createReview } from "@/lib/api"
import { useSession } from "@/lib/auth-client"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { cn } from "@/lib/utils"

function BarPicker({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
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
        <span className="ml-1 w-4 font-mono text-xs text-muted-foreground">{value}</span>
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
              i <= (hovered || value) ? "fill-accent text-accent" : "fill-transparent text-border",
            )}
          />
        </button>
      ))}
    </div>
  )
}

export function ReviewForm({
  catedras,
  materias,
  tags,
  carreras,
}: {
  catedras: CatedraStats[]
  materias: MateriaItem[]
  tags: TagItem[]
  carreras: CarreraItem[]
}) {
  const router = useRouter()
  const { data: session, isPending } = useSession()

  useEffect(() => {
    if (!isPending && !session) router.replace("/login")
  }, [session, isPending, router])

  const [catedraSlug, setCatedraSlug] = useState("")
  const [catedraId, setCatedraId] = useState<number | null>(null)
  const [materiaId, setMateriaId] = useState<number | null>(null)
  const [carreraId, setCarreraId] = useState<number | null>(null)
  const [rating, setRating] = useState(0)
  const [cargaHoraria, setCargaHoraria] = useState(3)
  const [dificultad, setDificultad] = useState(3)
  const [recomienda, setRecomienda] = useState<boolean | null>(null)
  const [texto, setTexto] = useState("")
  const [anio, setAnio] = useState(new Date().getFullYear())
  const [periodo, setPeriodo] = useState<"PRIMERO" | "SEGUNDO" | "VERANO">("PRIMERO")
  const [tagIds, setTagIds] = useState<number[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function toggleTag(id: number) {
    setTagIds((prev) => prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!catedraSlug) return setError("Seleccioná una cátedra")
    if (!catedraId) return setError("No se pudo resolver el ID de la cátedra — reiniciá el servidor")
    if (!materiaId) return setError("Seleccioná una materia")
    if (!carreraId) return setError("Seleccioná una carrera")
    if (rating === 0) return setError("Seleccioná una calificación")
    if (recomienda === null) return setError("Indicá si recomendás la cátedra")
    if (!texto.trim()) return setError("Escribí una reseña")

    setLoading(true)
    const result = await createReview({
      catedraId,
      materiaId,
      carreraId,
      rating,
      cargaHoraria,
      dificultad,
      recomienda,
      texto: texto.trim(),
      anio,
      periodo,
      tagIds,
    })
    setLoading(false)

    if (!result.success) {
      setError(result.error ?? "Error al crear la reseña")
      return
    }

    router.push("/")
    router.refresh()
  }

  const currentYear = new Date().getFullYear()

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {/* Cátedra, materia y carrera */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Cátedra <span className="text-destructive">*</span>
          </label>
          <select
            value={catedraSlug}
            onChange={(e) => {
              const slug = e.target.value
              setCatedraSlug(slug)
              const found = catedras.find((c) => c.slug === slug)
              console.log("[catedra found]", found)
              setCatedraId(found?.id ?? null)
            }}
            className="h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus:border-ring"
          >
            <option value="">Seleccioná una cátedra</option>
            {catedras.map((c) => (
              <option key={c.slug} value={c.slug}>{c.catedra}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Materia <span className="text-destructive">*</span>
          </label>
          <select
            value={materiaId ?? ""}
            onChange={(e) => setMateriaId(e.target.value ? Number(e.target.value) : null)}
            className="h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus:border-ring"
          >
            <option value="">Seleccioná una materia</option>
            {materias.map((m) => (
              <option key={m.slug} value={m.id}>{m.nombre}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Carrera <span className="text-destructive">*</span>
          </label>
          <select
            value={carreraId ?? ""}
            onChange={(e) => setCarreraId(e.target.value ? Number(e.target.value) : null)}
            className="h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus:border-ring"
          >
            <option value="">Seleccioná una carrera</option>
            {carreras.map((c) => (
              <option key={c.slug} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Calificación */}
      <div className="flex flex-col gap-3">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Calificación general <span className="text-destructive">*</span>
        </span>
        <StarPicker value={rating} onChange={setRating} />
      </div>

      {/* Métricas */}
      <div className="grid gap-6 sm:grid-cols-2">
        <BarPicker label="Carga horaria" value={cargaHoraria} onChange={setCargaHoraria} />
        <BarPicker label="Dificultad" value={dificultad} onChange={setDificultad} />
      </div>

      {/* Recomienda */}
      <div className="flex flex-col gap-3">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          ¿Recomendás la cátedra? <span className="text-destructive">*</span>
        </span>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setRecomienda(true)}
            className={cn(
              "inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors",
              recomienda === true
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:border-foreground/50 hover:text-foreground",
            )}
          >
            <Check className="size-4" />
            Sí
          </button>
          <button
            type="button"
            onClick={() => setRecomienda(false)}
            className={cn(
              "inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors",
              recomienda === false
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
        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Reseña <span className="text-destructive">*</span>
        </label>
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Contá tu experiencia con la cátedra..."
          rows={5}
          className="w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus:border-ring placeholder:text-muted-foreground"
        />
      </div>

      {/* Año y período */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Año cursado</label>
          <Input
            type="number"
            min={2000}
            max={currentYear}
            value={anio}
            onChange={(e) => setAnio(Number(e.target.value))}
            className="h-10"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Período</label>
          <select
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value as typeof periodo)}
            className="h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus:border-ring"
          >
            <option value="PRIMERO">Primer cuatrimestre</option>
            <option value="SEGUNDO">Segundo cuatrimestre</option>
            <option value="VERANO">Verano</option>
          </select>
        </div>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-col gap-3">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Tags</span>
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
                {t.nombre}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex items-center gap-4 border-t border-border pt-6">
        <Button type="submit" disabled={loading} className="px-8">
          {loading ? "Publicando..." : "Publicar reseña"}
        </Button>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}

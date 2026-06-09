"use client"

import { useMemo, useState } from "react"
import { Search, Check, SlidersHorizontal } from "lucide-react"
import type { Review, CarreraItem, MateriaItem } from "@/lib/api"
import { ReviewCard } from "@/app/components/review-card"
import { Input } from "@/app/components/ui/input"
import { Combobox } from "@/app/components/ui/combobox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select"
import { cn } from "@/lib/utils"

const ALL = "todas"

const orderOptions = [
  { value: "relevantes", label: "Más relevantes" },
  { value: "mejores", label: "Mejor puntuadas" },
  { value: "peores", label: "Peor puntuadas" },
  { value: "recientes", label: "Más recientes" },
]

const PERIODOS = [
  { value: "PRIMERO", label: "1er Cuatrimestre" },
  { value: "SEGUNDO", label: "2do Cuatrimestre" },
  { value: "VERANO", label: "Verano" },
] as const

type Periodo = typeof PERIODOS[number]["value"]
// ─── Feed ────────────────────────────────────────────────────────────────────

type Props = {
  reviews: Review[]
  carreras: CarreraItem[]
  materias: MateriaItem[]
}

export function ReviewsFeed({ reviews, carreras, materias }: Props) {
  const [query, setQuery] = useState("")
  const [carrera, setCarrera] = useState<string>(ALL)
  const [materia, setMateria] = useState<string>(ALL)
  const [catedra, setCatedra] = useState<string>(ALL)
  const [periodo, setPeriodo] = useState<Periodo | typeof ALL>(ALL)
  const [anioCursado, setAnioCursado] = useState<string>(ALL)
  const [soloRecomendadas, setSoloRecomendadas] = useState(false)
  const [orden, setOrden] = useState("relevantes")

  const anosCursados = useMemo(() => {
    const years = [...new Set(reviews.map((r) => r.anioCursado))].sort((a, b) => b - a)
    return years.map((y) => ({ value: String(y), label: String(y) }))
  }, [reviews])

  const materiasFiltradas = useMemo(() =>
    materias.filter((m) =>
      carrera === ALL || m.carreras.some((c) => c.nombre === carrera)
    )
  , [materias, carrera])

  const materiaActiva = materiasFiltradas.some((m) => m.nombre === materia) ? materia : ALL

  const catedrasDisponibles = useMemo(() => {
    const source = materiaActiva !== ALL
      ? materiasFiltradas.filter((m) => m.nombre === materiaActiva)
      : materiasFiltradas
    const nombres = source.flatMap((m) => m.catedras.map((c) => c.nombre))
    return [...new Set(nombres)].sort().map((c) => ({ value: c, label: c }))
  }, [materiasFiltradas, materiaActiva])

  const catedraActiva = catedrasDisponibles.some((c) => c.value === catedra) ? catedra : ALL

  const filtered = useMemo(() => {
    const result = reviews.filter((r) => {
      const matchQuery =
        query.trim() === "" ||
        [r.catedra, r.materia, r.titular, r.texto, r.autor]
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase())
      const matchCarrera = carrera === ALL || r.carrera === carrera
      const matchMateria = materiaActiva === ALL || r.materia === materiaActiva
      const matchCatedra = catedraActiva === ALL || r.catedra === catedraActiva
      const matchPeriodo = periodo === ALL || r.periodo === periodo
      const matchAnio = anioCursado === ALL || r.anioCursado === Number(anioCursado)
      const matchRecomendada = !soloRecomendadas || r.recomienda
      return matchQuery && matchCarrera && matchMateria && matchCatedra && matchPeriodo && matchAnio && matchRecomendada
    })

    return result.sort((a, b) => {
      switch (orden) {
        case "mejores": return b.rating - a.rating || b.likes - a.likes
        case "peores": return a.rating - b.rating
        case "recientes": return b.anioCursado - a.anioCursado
        default: return b.likes - a.likes
      }
    })
  }, [query, carrera, materiaActiva, catedraActiva, periodo, anioCursado, soloRecomendadas, orden, reviews])

  function reset() {
    setQuery("")
    setCarrera(ALL)
    setMateria(ALL)
    setCatedra(ALL)
    setPeriodo(ALL)
    setAnioCursado(ALL)
    setSoloRecomendadas(false)
    setOrden("relevantes")
  }

  const hasFilters =
    query !== "" || carrera !== ALL || materia !== ALL || catedra !== ALL ||
    periodo !== ALL || anioCursado !== ALL || soloRecomendadas

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 border-b border-border pb-5">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por cátedra, materia, docente o texto..."
            className="pl-9"
            aria-label="Buscar"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <SlidersHorizontal className="size-3.5 shrink-0 text-muted-foreground" />

          <Combobox
            label="Carrera"
            placeholder="Filtrar carreras..."
            options={carreras.map((c) => ({ value: c.nombre, label: c.nombre }))}
            value={carrera}
            onChange={(v) => { setCarrera(v); setMateria(ALL); setCatedra(ALL) }}
          />

          <Combobox
            label="Materia"
            placeholder="Filtrar materias..."
            options={materiasFiltradas.map((m) => ({ value: m.nombre, label: m.nombre }))}
            value={materiaActiva}
            onChange={(v) => { setMateria(v); setCatedra(ALL) }}
          />

          <Combobox
            label="Cátedra"
            placeholder="Filtrar cátedras..."
            options={catedrasDisponibles}
            value={catedraActiva}
            onChange={setCatedra}
          />

          <Combobox
            label="Período"
            placeholder="Filtrar período..."
            options={[...PERIODOS]}
            value={periodo}
            onChange={(v) => setPeriodo(v as Periodo | typeof ALL)}
          />

          {anosCursados.length > 1 && (
            <Combobox
              label="Año cursado"
              placeholder="Filtrar año..."
              options={anosCursados}
              value={anioCursado}
              onChange={setAnioCursado}
            />
          )}

          <button
            onClick={() => setSoloRecomendadas((v) => !v)}
            className={cn(
              "flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors",
              soloRecomendadas
                ? "border-foreground bg-foreground text-background"
                : "border-border text-foreground hover:border-foreground/50",
            )}
          >
            {soloRecomendadas && <Check className="size-3.5" />}
            Solo recomendadas
          </button>

          <div className="ml-auto flex items-center gap-4">
            {hasFilters && (
              <button
                onClick={reset}
                className="text-xs font-medium text-accent underline underline-offset-4 hover:opacity-80"
              >
                Limpiar filtros
              </button>
            )}
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{filtered.length}</span>{" "}
              {filtered.length === 1 ? "reseña" : "reseñas"}
            </p>
            <Select value={orden} onValueChange={setOrden}>
              <SelectTrigger className="h-8 w-[150px] text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {orderOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="flex flex-col gap-4">
          {filtered.map((r) => <ReviewCard key={r.id} review={r} />)}
        </div>
      ) : (
        <div className="border border-dashed border-border py-20 text-center">
          <p className="text-2xl font-semibold tracking-tight text-foreground">Sin resultados</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Probá ajustar los filtros o limpiar la búsqueda.
          </p>
          <button
            onClick={reset}
            className="mt-4 text-sm font-medium text-accent underline underline-offset-4"
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  )
}

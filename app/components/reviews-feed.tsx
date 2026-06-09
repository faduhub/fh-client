"use client"

import { useMemo, useState } from "react"
import { Search, Check, SlidersHorizontal, FilterIcon } from "lucide-react"
import type { Review } from "@/lib/api/dtos/responses/review"
import type { DegreeItem } from "@/lib/api/dtos/responses/degree"
import type { SubjectItem } from "@/lib/api/dtos/responses/subject"
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
  { value: "FIRST", label: "1er Cuatrimestre" },
  { value: "SECOND", label: "2do Cuatrimestre" },
  { value: "SUMMER", label: "Verano" },
] as const

type Periodo = typeof PERIODOS[number]["value"]
// ─── Feed ────────────────────────────────────────────────────────────────────

type Props = {
  reviews: Review[]
  degrees: DegreeItem[]
  subjects: SubjectItem[]
}

export function ReviewsFeed({ reviews, degrees, subjects }: Props) {
  const [query, setQuery] = useState("")
  const [degree, setDegree] = useState<string>(ALL)
  const [subject, setSubject] = useState<string>(ALL)
  const [department, setDepartment] = useState<string>(ALL)
  const [period, setPeriod] = useState<Periodo | typeof ALL>(ALL)
  const [yearFilter, setYearFilter] = useState<string>(ALL)
  const [soloRecomendadas, setSoloRecomendadas] = useState(false)
  const [orden, setOrden] = useState("relevantes")

  const anosCursados = useMemo(() => {
    const years = [...new Set(reviews.map((r) => r.year))].sort((a, b) => b - a)
    return years.map((y) => ({ value: String(y), label: String(y) }))
  }, [reviews])

  const filteredSubjects = useMemo(() =>
    subjects.filter((m) =>
      degree === ALL || m.degrees.some((c) => c.name === degree)
    )
  , [subjects, degree])

  const activeSubject = filteredSubjects.some((m) => m.name === subject) ? subject : ALL

  const availableDepartments = useMemo(() => {
    const source = activeSubject !== ALL
      ? filteredSubjects.filter((m) => m.name === activeSubject)
      : filteredSubjects
    const nombres = source.flatMap((m) => m.departments.map((c) => c.name))
    return [...new Set(nombres)].sort().map((c) => ({ value: c, label: c }))
  }, [filteredSubjects, activeSubject])

  const activeDepartment = availableDepartments.some((c) => c.value === department) ? department : ALL

  const filtered = useMemo(() => {
    const result = reviews.filter((r) => {
      const matchQuery =
        query.trim() === "" ||
        [r.department, r.subject, r.head, r.body, r.author]
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase())
      const matchCarrera = degree === ALL || r.degree === degree
      const matchMateria = activeSubject === ALL || r.subject === activeSubject
      const matchCatedra = activeDepartment === ALL || r.department === activeDepartment
      const matchPeriodo = period === ALL || r.period === period
      const matchAnio = yearFilter === ALL || r.year === Number(yearFilter)
      const matchRecomendada = !soloRecomendadas || r.recommends
      return matchQuery && matchCarrera && matchMateria && matchCatedra && matchPeriodo && matchAnio && matchRecomendada
    })

    return result.sort((a, b) => {
      switch (orden) {
        case "mejores": return (b.rating ?? 0) - (a.rating ?? 0) || b.likes - a.likes
        case "peores": return (a.rating ?? 0) - (b.rating ?? 0)
        case "recientes": return b.year - a.year
        default: return b.likes - a.likes
      }
    })
  }, [query, degree, activeSubject, activeDepartment, period, yearFilter, soloRecomendadas, orden, reviews])

  function reset() {
    setQuery("")
    setDegree(ALL)
    setSubject(ALL)
    setDepartment(ALL)
    setPeriod(ALL)
    setYearFilter(ALL)
    setSoloRecomendadas(false)
    setOrden("relevantes")
  }

  const hasFilters =
    query !== "" || degree !== ALL || subject !== ALL || department !== ALL ||
    period !== ALL || yearFilter !== ALL || soloRecomendadas

  return (
    <div className="flex gap-8 items-start">
      {/* Sidebar de filtros — sticky en desktop */}
      <aside className="hidden lg:flex flex-col gap-5 w-64 shrink-0 sticky top-6 bg-card border-border border p-5 rounded-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-1.5 text-sm font-medium text-foreground">
            <FilterIcon className="size-3.5" />
            Filtros
          </div>
          {hasFilters && (
            <button
              onClick={reset}
              className="text-xs font-medium text-accent underline underline-offset-4 hover:opacity-80"
            >
              Limpiar
            </button>
          )}
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar"
            className="pl-9"
            aria-label="Buscar"
          />
        </div>

        <div className="flex flex-col gap-y-5">
          <Combobox
            label="Carrera"
            placeholder="Filtrar carreras..."
            options={degrees.map((c) => ({ value: c.name, label: c.name }))}
            value={degree}
            onChange={(v) => { setDegree(v); setSubject(ALL); setDepartment(ALL) }}
          />

          <Combobox
            label="Materia"
            placeholder="Filtrar materias..."
            options={filteredSubjects.map((m) => ({ value: m.name, label: m.name }))}
            value={activeSubject}
            onChange={(v) => { setSubject(v); setDepartment(ALL) }}
          />

          <Combobox
            label="Cátedra"
            placeholder="Filtrar cátedras..."
            options={availableDepartments}
            value={activeDepartment}
            onChange={setDepartment}
          />

          <Combobox
            label="Período"
            placeholder="Filtrar período..."
            options={[...PERIODOS]}
            value={period}
            onChange={(v) => setPeriod(v as Periodo | typeof ALL)}
          />

          {anosCursados.length > 1 && (
            <Combobox
              label="Año cursado"
              placeholder="Filtrar año..."
              options={anosCursados}
              value={yearFilter}
              onChange={setYearFilter}
            />
          )}
        </div>

        <button
          onClick={() => setSoloRecomendadas((v) => !v)}
          className={cn(
            "flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors w-full justify-center",
            soloRecomendadas
              ? "border-foreground bg-foreground text-background"
              : "border-border text-foreground hover:border-foreground/50",
          )}
        >
          {soloRecomendadas && <Check className="size-3.5" />}
          Solo recomendadas
        </button>
      </aside>

      {/* Columna principal */}
      <div className="flex flex-col gap-6 flex-1 min-w-0">
        {/* Filtros mobile */}
        <div className="flex flex-col gap-3 border-b border-border pb-5 lg:hidden">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar"
              className="pl-9"
              aria-label="Buscar"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Combobox
              label="Carrera"
              placeholder="Filtrar carreras..."
              options={degrees.map((c) => ({ value: c.name, label: c.name }))}
              value={degree}
              onChange={(v) => { setDegree(v); setSubject(ALL); setDepartment(ALL) }}
            />
            <Combobox
              label="Materia"
              placeholder="Filtrar materias..."
              options={filteredSubjects.map((m) => ({ value: m.name, label: m.name }))}
              value={activeSubject}
              onChange={(v) => { setSubject(v); setDepartment(ALL) }}
            />
            <Combobox
              label="Cátedra"
              placeholder="Filtrar cátedras..."
              options={availableDepartments}
              value={activeDepartment}
              onChange={setDepartment}
            />
            <Combobox
              label="Período"
              placeholder="Filtrar período..."
              options={[...PERIODOS]}
              value={period}
              onChange={(v) => setPeriod(v as Periodo | typeof ALL)}
            />
            {anosCursados.length > 1 && (
              <Combobox
                label="Año cursado"
                placeholder="Filtrar año..."
                options={anosCursados}
                value={yearFilter}
                onChange={setYearFilter}
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
          </div>
        </div>

        {/* Header con contador y orden */}
        <div className="flex items-center justify-between  border-border border-b pb-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{filtered.length}</span>{" "}
            {filtered.length === 1 ? "reseña" : "reseñas"}
          </p>
          <div className="flex">
            {hasFilters && (
              <button
                onClick={reset}
                className="text-xs font-medium text-accent underline underline-offset-4 hover:opacity-80 lg:hidden"
              >
                Limpiar filtros
              </button>
            )}
            <Select value={orden} onValueChange={(v) => v && setOrden(v)}>
              <SelectTrigger ><SelectValue /></SelectTrigger>
              <SelectContent>
                {orderOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
    </div>
  )
}

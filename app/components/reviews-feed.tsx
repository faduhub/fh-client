"use client"

import { useMemo, useState } from "react"
import type { Review } from "@/lib/api/dtos/responses/review"
import type { DegreeItem } from "@/lib/api/dtos/responses/degree"
import type { SubjectItem } from "@/lib/api/dtos/responses/subject"
import { ReviewCard } from "@/app/components/review-card"
import { FilterCard } from "@/app/components/filter-card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select"

const ALL = "todas"

const orderOptions = [
  { value: "relevantes", label: "Más relevantes" },
  { value: "mejores", label: "Mejor puntuadas" },
  { value: "peores", label: "Peor puntuadas" },
  { value: "recientes", label: "Más recientes" },
]

type Periodo = "FIRST" | "SECOND" | "SUMMER"
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

  const filteredSubjects = useMemo(
    () => subjects.filter((m) => degree === ALL || m.degrees.some((c) => c.name === degree)),
    [subjects, degree],
  )

  const activeSubject = filteredSubjects.some((m) => m.name === subject) ? subject : ALL

  const availableDepartments = useMemo(() => {
    const source =
      activeSubject !== ALL
        ? filteredSubjects.filter((m) => m.name === activeSubject)
        : filteredSubjects
    const nombres = source.flatMap((m) => m.departments.map((c) => c.name))
    return [...new Set(nombres)].sort().map((c) => ({ value: c, label: c }))
  }, [filteredSubjects, activeSubject])

  const activeDepartment = availableDepartments.some((c) => c.value === department)
    ? department
    : ALL

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
      return (
        matchQuery &&
        matchCarrera &&
        matchMateria &&
        matchCatedra &&
        matchPeriodo &&
        matchAnio &&
        matchRecomendada
      )
    })

    return result.sort((a, b) => {
      switch (orden) {
        case "mejores":
          return (b.rating ?? 0) - (a.rating ?? 0) || b.likes - a.likes
        case "peores":
          return (a.rating ?? 0) - (b.rating ?? 0)
        case "recientes":
          return b.year - a.year
        default:
          return b.likes - a.likes
      }
    })
  }, [
    query,
    degree,
    activeSubject,
    activeDepartment,
    period,
    yearFilter,
    soloRecomendadas,
    orden,
    reviews,
  ])

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
    query !== "" ||
    degree !== ALL ||
    subject !== ALL ||
    department !== ALL ||
    period !== ALL ||
    yearFilter !== ALL ||
    soloRecomendadas

  return (
    <div className="flex items-start gap-8">
      <FilterCard
        filters={{
          query,
          degree,
          activeSubject,
          activeDepartment,
          period,
          yearFilter,
          soloRecomendadas,
        }}
        handlers={{
          setQuery,
          onDegreeChange: (v) => {
            setDegree(v)
            setSubject(ALL)
            setDepartment(ALL)
          },
          onSubjectChange: (v) => {
            setSubject(v)
            setDepartment(ALL)
          },
          setDepartment,
          setPeriod,
          setYearFilter,
          setSoloRecomendadas,
          reset,
        }}
        degrees={degrees}
        filteredSubjects={filteredSubjects}
        availableDepartments={availableDepartments}
        anosCursados={anosCursados}
        hasFilters={hasFilters}
      />

      {/* Columna principal */}
      <div className="flex min-w-0 flex-1 flex-col gap-6">
        {/* Header con contador y orden */}
        <div className="border-border flex items-center justify-between border-b pb-4">
          <p className="text-muted-foreground text-sm">
            <span className="text-foreground font-medium">{filtered.length}</span>{" "}
            {filtered.length === 1 ? "experiencias" : "experiencia"}
          </p>
          <div className="flex">
            <Select value={orden} onValueChange={(v) => v && setOrden(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {orderOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="flex flex-col gap-4">
            {filtered.map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>
        ) : (
          <div className="border-border border border-dashed py-20 text-center">
            <p className="text-foreground text-2xl font-semibold tracking-tight">Sin resultados</p>
            <p className="text-muted-foreground mt-2 text-sm">
              Probá ajustar los filtros o limpiar la búsqueda.
            </p>
            <button
              onClick={reset}
              className="text-accent mt-4 text-sm font-medium underline underline-offset-4"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

"use client"

import { Search, Check, FilterIcon } from "lucide-react"
import type { DegreeItem } from "@/lib/api/dtos/responses/degree"
import type { SubjectItem } from "@/lib/api/dtos/responses/subject"
import { Input } from "@/app/components/ui/input"
import { Combobox } from "@/app/components/ui/combobox"
import { cn } from "@/lib/utils"

const ALL = "todas"

const PERIODOS = [
  { value: "FIRST", label: "1er Cuatrimestre" },
  { value: "SECOND", label: "2do Cuatrimestre" },
  { value: "SUMMER", label: "Verano" },
] as const

type Periodo = (typeof PERIODOS)[number]["value"]

type Option = { value: string; label: string }

export type FilterState = {
  query: string
  degree: string
  activeSubject: string
  activeDepartment: string
  period: Periodo | typeof ALL
  yearFilter: string
  soloRecomendadas: boolean
}

export type FilterHandlers = {
  setQuery: (v: string) => void
  onDegreeChange: (v: string) => void
  onSubjectChange: (v: string) => void
  setDepartment: (v: string) => void
  setPeriod: (v: Periodo | typeof ALL) => void
  setYearFilter: (v: string) => void
  setSoloRecomendadas: (v: (prev: boolean) => boolean) => void
  reset: () => void
}

type Props = {
  filters: FilterState
  handlers: FilterHandlers
  degrees: DegreeItem[]
  filteredSubjects: SubjectItem[]
  availableDepartments: Option[]
  anosCursados: Option[]
  hasFilters: boolean
}

export function FilterCard({
  filters,
  handlers,
  degrees,
  filteredSubjects,
  availableDepartments,
  anosCursados,
  hasFilters,
}: Props) {
  const { query, degree, activeSubject, activeDepartment, period, yearFilter, soloRecomendadas } =
    filters
  const {
    setQuery,
    onDegreeChange,
    onSubjectChange,
    setDepartment,
    setPeriod,
    setYearFilter,
    setSoloRecomendadas,
    reset,
  } = handlers

  return (
    <aside className="bg-card border-border sticky top-6 hidden w-64 shrink-0 flex-col gap-5 rounded-md border p-5 lg:flex">
      <div className="flex items-center justify-between">
        <div className="text-foreground flex items-center gap-x-1.5 text-sm font-medium">
          <FilterIcon className="size-3.5" />
          Filtros
        </div>
        {hasFilters && (
          <button
            onClick={reset}
            className="text-accent text-xs font-medium underline underline-offset-4 hover:opacity-80"
          >
            Limpiar
          </button>
        )}
      </div>

      <div className="relative">
        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
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
          options={degrees.map((c) => ({ value: c.name, label: c.name }))}
          value={degree}
          onChange={onDegreeChange}
        />

        <Combobox
          label="Materia"
          options={filteredSubjects.map((m) => ({ value: m.name, label: m.name }))}
          value={activeSubject}
          onChange={onSubjectChange}
        />

        <Combobox
          label="Cátedra"
          options={availableDepartments}
          value={activeDepartment}
          onChange={setDepartment}
        />

        <Combobox
          label="Período"
          options={[...PERIODOS]}
          value={period}
          onChange={(v) => setPeriod(v as Periodo | typeof ALL)}
        />

        {anosCursados.length > 1 && (
          <Combobox
            label="Año cursado"
            options={anosCursados}
            value={yearFilter}
            onChange={setYearFilter}
          />
        )}
      </div>

      <button
        onClick={() => setSoloRecomendadas((v) => !v)}
        className={cn(
          "flex w-full items-center justify-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors",
          soloRecomendadas
            ? "border-foreground bg-foreground text-background"
            : "border-border text-foreground hover:border-foreground/50",
        )}
      >
        {soloRecomendadas && <Check className="size-3.5" />}
        Solo recomendadas
      </button>
    </aside>
  )
}

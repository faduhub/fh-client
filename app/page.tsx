"use client"

import { useMemo, useState } from "react"
import { Search, SlidersHorizontal } from "lucide-react"
import { carreras, materias, reviews, type Carrera } from "@/lib/data"
import { ReviewCard } from "@/app/components/review-card"
import { Input } from "@/app/components/ui/input"
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

export default function Page() {
  const [query, setQuery] = useState("")
  const [carrera, setCarrera] = useState<Carrera | typeof ALL>(ALL)
  const [materia, setMateria] = useState<string>(ALL)
  const [minRating, setMinRating] = useState(0)
  const [orden, setOrden] = useState("relevantes")

  const filtered = useMemo(() => {
    const result = reviews.filter((r) => {
      const matchQuery =
        query.trim() === "" ||
        [r.catedra, r.materia, r.titular, r.texto, r.autor]
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase())
      const matchCarrera = carrera === ALL || r.carrera === carrera
      const matchMateria = materia === ALL || r.materia === materia
      const matchRating = r.rating >= minRating
      return matchQuery && matchCarrera && matchMateria && matchRating
    })

    return result.sort((a, b) => {
      switch (orden) {
        case "mejores":
          return b.rating - a.rating || b.likes - a.likes
        case "peores":
          return a.rating - b.rating
        case "recientes":
          return 0
        default:
          return b.likes - a.likes
      }
    })
  }, [query, carrera, materia, minRating, orden])

  const promedio =
    reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length

  function reset() {
    setQuery("")
    setCarrera(ALL)
    setMateria(ALL)
    setMinRating(0)
    setOrden("relevantes")
  }

  const hasFilters =
    query !== "" || carrera !== ALL || materia !== ALL || minRating !== 0

  return (
    <main className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold leading-none tracking-tight text-foreground">cátedras</span>
            <span className="font-mono text-xs uppercase tracking-widest text-accent">FADU</span>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground sm:flex">
            <a href="#reseñas" className="transition-colors hover:text-foreground">
              Reseñas
            </a>
            <a href="/catedras" className="transition-colors hover:text-foreground">
              Cátedras
            </a>
            <a
              href="#"
              className="rounded-full bg-foreground px-4 py-1.5 text-background transition-opacity hover:opacity-90"
            >
              Dejar reseña
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            Reseñas de cursadas · escritas por estudiantes
          </p>
          <h1 className="mt-4 max-w-3xl text-balance text-5xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-7xl">
            Elegí tu cátedra sabiendo en qué te metés.
          </h1>
          <p className="mt-6 max-w-xl text-pretty leading-relaxed text-muted-foreground">
            Opiniones reales sobre las cursadas de la Facultad de Arquitectura, Diseño y Urbanismo.
            Filtrá por carrera, materia y puntaje antes de inscribirte al cuatrimestre.
          </p>

          <dl className="mt-10 flex flex-wrap gap-x-12 gap-y-6">
            <div>
              <dt className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Reseñas</dt>
              <dd className="text-4xl font-bold tracking-tight text-foreground">{reviews.length * 47}</dd>
            </div>
            <div>
              <dt className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Cátedras</dt>
              <dd className="text-4xl font-bold tracking-tight text-foreground">312</dd>
            </div>
            <div>
              <dt className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Promedio</dt>
              <dd className="text-4xl font-bold tracking-tight text-foreground">{promedio.toFixed(1)}</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Filters + feed */}
      <section id="reseñas" className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
          {/* Sidebar filters */}
          <aside className="lg:sticky lg:top-8 lg:self-start">
            <div className="mb-4 flex items-center gap-2 text-sm font-medium text-foreground">
              <SlidersHorizontal className="size-4" />
              Filtros
            </div>

            <div className="flex flex-col gap-6">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar cátedra o materia"
                  className="pl-9"
                  aria-label="Buscar"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Carrera
                </label>
                <Select value={carrera} onValueChange={(v) => setCarrera(v as Carrera | typeof ALL)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL}>Todas las carreras</SelectItem>
                    {carreras.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Materia
                </label>
                <Select value={materia} onValueChange={setMateria}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL}>Todas las materias</SelectItem>
                    {materias.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Puntaje mínimo
                </label>
                <div className="flex gap-1.5">
                  {[0, 2, 3, 4].map((n) => (
                    <button
                      key={n}
                      onClick={() => setMinRating(n)}
                      className={cn(
                        "flex-1 rounded-md border py-1.5 text-xs font-medium transition-colors",
                        minRating === n
                          ? "border-foreground bg-foreground text-background"
                          : "border-border text-muted-foreground hover:border-foreground/40",
                      )}
                    >
                      {n === 0 ? "Todos" : `${n}+`}
                    </button>
                  ))}
                </div>
              </div>

              {hasFilters && (
                <button
                  onClick={reset}
                  className="text-left text-xs font-medium text-accent underline underline-offset-4 hover:opacity-80"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          </aside>

          {/* Feed */}
          <div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{filtered.length}</span>{" "}
                {filtered.length === 1 ? "reseña" : "reseñas"}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">Ordenar</span>
                <Select value={orden} onValueChange={setOrden}>
                  <SelectTrigger className="h-8 w-[170px] text-xs">
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
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-6 py-8 text-xs text-muted-foreground sm:flex-row">
          <p>Reseñas de Cátedras · FADU — proyecto de ejemplo.</p>
          <p className="font-mono uppercase tracking-wider">Hecho por estudiantes, para estudiantes</p>
        </div>
      </footer>
    </main>
  )
}

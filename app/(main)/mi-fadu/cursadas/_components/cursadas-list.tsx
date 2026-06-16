"use client"

import Link from "next/link"
import type { Cursada, AcademicPeriod, CursadaStatus } from "@/lib/api/dtos/responses/cursada"
import { BookOpen, Loader2, PenLine, Pencil, X } from "lucide-react"

const eyebrowClass = "text-muted-foreground font-mono text-[0.7rem] tracking-widest uppercase"

const PERIOD_LABEL: Record<AcademicPeriod, string> = {
  FIRST: "1° cuatrimestre",
  SECOND: "2° cuatrimestre",
  SUMMER: "Verano",
}

const STATUS_CLASS: Record<CursadaStatus, string> = {
  CURSANDO: "border-primary/40 text-primary",
  APROBADA: "border-emerald-500/40 text-emerald-600 dark:text-emerald-400",
  REGULAR: "border-amber-500/40 text-amber-600 dark:text-amber-400",
  ABANDONADA: "border-destructive/40 text-destructive",
}

const STATUS_LABEL: Record<CursadaStatus, string> = {
  CURSANDO: "Cursando",
  REGULAR: "Regular",
  APROBADA: "Aprobada",
  ABANDONADA: "Abandonada",
}

type CursadasListProps = {
  cursadas: Cursada[]
  loading: boolean
  pending: boolean
  onEditRequest: (cursada: Cursada) => void
  onDeleteRequest: (cursada: Cursada) => void
}

export function CursadasList({
  cursadas,
  loading,
  pending,
  onEditRequest,
  onDeleteRequest,
}: CursadasListProps) {
  if (loading) {
    return (
      <div className="text-muted-foreground flex items-center gap-2 py-4 text-sm">
        <Loader2 className="size-4 animate-spin" />
        Cargando materias…
      </div>
    )
  }

  if (cursadas.length === 0) {
    return (
      <p className="border-border bg-secondary/30 text-muted-foreground rounded-xl border border-dashed px-4 py-6 text-center text-sm">
        Todavía no agregaste materias.
      </p>
    )
  }

  return (
    <ul className="flex flex-col gap-2.5">
      {cursadas.map((cursada) => {
        const meta = [
          cursada.department?.name,
          cursada.period ? PERIOD_LABEL[cursada.period] : null,
        ].filter(Boolean)

        const experienciaParams = new URLSearchParams({ materia: cursada.subject.slug })
        if (cursada.department) experienciaParams.set("catedra", cursada.department.slug)
        if (cursada.degree) experienciaParams.set("carrera", cursada.degree.slug)

        return (
          <li
            key={cursada.id}
            className="border-border bg-secondary/40 group flex items-center gap-4 rounded-xl border px-4 py-3.5"
          >
            <BookOpen className="text-primary size-5 shrink-0" strokeWidth={1.5} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2.5">
                <p className="text-foreground truncate font-medium">{cursada.subject.name}</p>
                <span
                  className={`shrink-0 rounded-full border px-2 py-0.5 font-mono text-[0.6rem] font-medium tracking-wider uppercase ${STATUS_CLASS[cursada.status]}`}
                >
                  {STATUS_LABEL[cursada.status]}
                </span>
              </div>
              {meta.length > 0 && (
                <p className={`mt-1 truncate ${eyebrowClass}`}>{meta.join(" · ")}</p>
              )}
            </div>
            {!cursada.hasExperience && (
              <Link
                href={`/experiencias/crear?${experienciaParams.toString()}`}
                className="border-primary/40 text-primary hover:bg-primary/10 inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors"
              >
                <PenLine className="size-3.5" strokeWidth={2} />
                Compartir experiencia
              </Link>
            )}
            <button
              type="button"
              onClick={() => onEditRequest(cursada)}
              disabled={pending}
              aria-label={`Editar ${cursada.subject.name}`}
              className="text-muted-foreground hover:bg-secondary hover:text-foreground flex size-7 shrink-0 items-center justify-center rounded-lg transition-colors disabled:opacity-40"
            >
              <Pencil className="size-4" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => onDeleteRequest(cursada)}
              disabled={pending}
              aria-label={`Quitar ${cursada.subject.name}`}
              className="text-muted-foreground hover:bg-destructive/15 hover:text-destructive flex size-7 shrink-0 items-center justify-center rounded-lg transition-colors disabled:opacity-40"
            >
              <X className="size-4" strokeWidth={1.5} />
            </button>
          </li>
        )
      })}
    </ul>
  )
}

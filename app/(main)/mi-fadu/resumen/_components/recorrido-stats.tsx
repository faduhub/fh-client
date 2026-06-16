"use client"

import { Recorrido } from "@/lib/api/dtos/responses/recorrido"

const eyebrowClass = "text-muted-foreground font-mono text-[0.7rem] tracking-widest uppercase"

function ProgressBar({ percent, className = "h-2" }: { percent: number; className?: string }) {
  return (
    <div className={`bg-secondary w-full overflow-hidden rounded-full ${className}`}>
      <div
        className="from-primary h-full rounded-full bg-linear-to-r to-purple-500"
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}

export function RecorridoStats({ recorrido }: { recorrido: Recorrido }) {
  return (
    <>
      {" "}
      <div>
        <ProgressBar percent={recorrido.totals.percent} />
        <p className={`mt-2 ${eyebrowClass}`}>
          {recorrido.totals.loaded} de {recorrido.totals.plan} materias cargadas
          {recorrido.currentYear.label ? ` · ${recorrido.currentYear.label}` : ""}
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {recorrido.years.map((year) => (
          <div key={year.year} className="border-border bg-background/40 rounded-xl border p-4">
            <div className="flex items-center justify-between">
              <span className={eyebrowClass}>{year.year}° año</span>
              <span className="text-muted-foreground text-sm tabular-nums">
                {year.loaded}/{year.total}
              </span>
            </div>
            <ProgressBar percent={year.percent} className="mt-3 h-1.5" />
          </div>
        ))}
      </div>
    </>
  )
}

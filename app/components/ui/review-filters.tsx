"use client"

import { useState } from "react"
import { SlidersHorizontal } from "lucide-react"

const filters = ["Todas", "Diseño Gráfico", "Morfología", "Tipografía", "Cátedras buenas"]

export function ReviewFilters() {
  const [active, setActive] = useState("Todas")

  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((filter) => {
        const isActive = filter === active
        return (
          <button
            key={filter}
            type="button"
            onClick={() => setActive(filter)}
            className={
              isActive
                ? "border-primary/50 bg-primary/15 text-primary shadow-primary/50 rounded-full border px-4 py-1.5 font-mono text-xs tracking-[0.1em] uppercase shadow-[0_0_20px_-6px] transition-colors"
                : "border-border bg-card/60 text-muted-foreground hover:border-primary/40 hover:text-foreground rounded-full border px-4 py-1.5 font-mono text-xs tracking-[0.1em] uppercase transition-colors"
            }
          >
            {filter}
          </button>
        )
      })}
      <button
        type="button"
        className="border-border bg-card/60 text-muted-foreground hover:border-primary/40 hover:text-foreground inline-flex items-center gap-2 rounded-full border px-4 py-1.5 font-mono text-xs tracking-[0.1em] uppercase transition-colors"
      >
        <SlidersHorizontal className="size-3.5" strokeWidth={1.5} />
        Más filtros
      </button>
    </div>
  )
}

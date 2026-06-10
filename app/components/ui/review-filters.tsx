'use client'

import { useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'

const filters = [
  'Todas',
  'Diseño Gráfico',
  'Morfología',
  'Tipografía',
  'Cátedras buenas',
]

export function ReviewFilters() {
  const [active, setActive] = useState('Todas')

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
                ? 'rounded-full border border-primary/50 bg-primary/15 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.1em] text-primary shadow-[0_0_20px_-6px] shadow-primary/50 transition-colors'
                : 'rounded-full border border-border bg-card/60 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground'
            }
          >
            {filter}
          </button>
        )
      })}
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
      >
        <SlidersHorizontal className="size-3.5" strokeWidth={1.5} />
        Más filtros
      </button>
    </div>
  )
}

'use client'

import { GradientAvatar } from './ui/gradient-avatar'
import { Star } from 'lucide-react'

// Avatares flotando — los mismos avatares por defecto del sistema, como elemento de marca.
const FLOATERS = [
  { seed: 'sofii_rdgz', size: 'size-20', pos: 'left-[8%] top-[12%]', delay: '0s', dur: '7s' },
  { seed: 'mateo.arq', size: 'size-14', pos: 'left-[62%] top-[6%]', delay: '0.8s', dur: '6s' },
  { seed: 'valen-ind', size: 'size-24', pos: 'left-[40%] top-[30%]', delay: '0.3s', dur: '8s' },
  { seed: 'caro_indu', size: 'size-12', pos: 'left-[12%] top-[52%]', delay: '1.2s', dur: '6.5s' },
  { seed: 'lucia.son', size: 'size-16', pos: 'left-[70%] top-[44%]', delay: '0.5s', dur: '7.5s' },
  { seed: 'fede-paisaje', size: 'size-14', pos: 'left-[44%] top-[66%]', delay: '1.6s', dur: '6.2s' },
  { seed: 'noe_grafico', size: 'size-10', pos: 'left-[24%] top-[78%]', delay: '0.2s', dur: '7.8s' },
  { seed: 'tomi.arq2', size: 'size-12', pos: 'left-[74%] top-[74%]', delay: '1s', dur: '6.8s' },
]

export function RegisterHero() {
  return (
    <div className="relative flex h-full flex-col justify-between overflow-hidden p-10 lg:p-14">
      {/* glows de fondo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-10 size-96 rounded-full bg-primary/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 bottom-0 size-96 rounded-full bg-accent/20 blur-3xl"
      />
      {/* grilla sutil */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07] bg-[linear-gradient(to_right,var(--color-foreground)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-foreground)_1px,transparent_1px)] bg-size-[48px_48px]"
      />

      {/* constelación de avatares */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {FLOATERS.map((f) => (
          <div
            key={f.seed}
            className={`absolute ${f.pos} animate-[floatY_var(--dur)_ease-in-out_infinite]`}
            style={
              {
                '--dur': f.dur,
                animationDelay: f.delay,
              } as React.CSSProperties
            }
          >
            <GradientAvatar
              seed={f.seed}
              className={`${f.size} border border-border/60 shadow-[0_8px_40px_-12px] shadow-primary/40`}
            />
          </div>
        ))}
      </div>

      <div className="relative max-w-md">
        <h2 className="text-balance font-serif text-4xl font-medium leading-[1.05] tracking-tight text-foreground sm:text-5xl">
          Elegí mejor tus cátedras.
        </h2>
        <p className="mt-4 max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
          Reseñas honestas de estudiantes reales de la FADU. Sumate y compartí
          tu experiencia para que nadie elija a ciegas.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
          <Stat value="2.4k" label="Reseñas" />
          <span aria-hidden="true" className="h-8 w-px bg-border" />
          <Stat value="180+" label="Cátedras" />
          <span aria-hidden="true" className="h-8 w-px bg-border" />
          <div className="flex flex-col">
            <span className="flex items-center gap-1 font-serif text-2xl font-medium text-foreground">
              4.6
              <Star className="size-4 fill-primary text-primary" />
            </span>
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
              Promedio
            </span>
          </div>
        </div>
      </div>

      <p className="relative font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground/60">
        &gt;_ Tu opinión ayuda mucho
      </p>
    </div>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col">
      <span className="font-serif text-2xl font-medium text-foreground">{value}</span>
      <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </span>
    </div>
  )
}

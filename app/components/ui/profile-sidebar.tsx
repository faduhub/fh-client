import { Star, ThumbsUp, Check, BadgeCheck, Flame, Award } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { GradientAvatar } from './gradient-avatar'

type Stat = {
  icon: LucideIcon
  value: string
  label: string
}

const stats: Stat[] = [
  { icon: Star, value: '1', label: 'Reseñas' },
  { icon: Star, value: '5.0', label: 'Puntaje' },
  { icon: ThumbsUp, value: '142', label: 'Likes' },
  { icon: Check, value: '100%', label: 'Recomienda' },
]

type UserBadge = {
  icon: LucideIcon
  label: string
}

const badges: UserBadge[] = [
  { icon: BadgeCheck, label: 'Reviewer verificado' },
  { icon: Flame, label: 'En racha' },
  { icon: Award, label: 'Top aporte' },
]

const SEED = 'martina-ferreyra'

export function ProfileSidebar() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card/80 backdrop-blur-sm">
      {/* Encabezado con gradiente */}
      <div className="relative flex flex-col items-center gap-4 bg-gradient-to-b from-primary/20 via-accent/10 to-transparent px-6 pb-6 pt-8 text-center">
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-primary">
          Estudiante · FADU
        </span>
        <div className="relative">
          <div
            className="absolute -inset-1 rounded-full bg-gradient-to-tr from-primary to-accent opacity-70 blur-[6px]"
            aria-hidden="true"
          />
          <GradientAvatar
            seed={SEED}
            className="relative size-24 border border-border"
          />
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="font-serif text-2xl font-medium tracking-tight text-foreground">
            Martina Ferreyra
          </h1>
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
            Diseño Gráfico
          </p>
        </div>

        {/* Badges de usuario */}
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          {badges.map(({ icon: Icon, label }) => (
            <span
              key={label}
              title={label}
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[0.7rem] text-primary"
            >
              <Icon className="size-3" strokeWidth={2} />
              {label}
            </span>
          ))}
        </div>

        <p className="text-pretty text-sm leading-relaxed text-foreground/80">
          Estudiante de DG, ciclo superior. Dejo reseñas honestas para los que
          vienen atrás.
        </p>
      </div>

      {/* Stats grid */}
      <dl className="grid grid-cols-2 gap-px bg-border">
        {stats.map(({ icon: Icon, value, label }) => (
          <div
            key={label}
            className="flex flex-col gap-3 bg-card p-5 transition-colors hover:bg-secondary"
          >
            <Icon
              className="size-4 text-primary"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <div className="flex flex-col gap-0.5">
              <dd className="font-serif text-2xl font-medium leading-none text-foreground">
                {value}
              </dd>
              <dt className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
                {label}
              </dt>
            </div>
          </div>
        ))}
      </dl>
    </div>
  )
}

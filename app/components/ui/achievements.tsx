import { Sparkles, Pen, Heart, type LucideIcon } from 'lucide-react'

type Achievement = {
  icon: LucideIcon
  title: string
  desc: string
  unlocked: boolean
}

const achievements: Achievement[] = [
  {
    icon: Sparkles,
    title: 'Primer review',
    desc: '¡Gracias por animarte!',
    unlocked: true,
  },
  {
    icon: Pen,
    title: 'Reviewer activo',
    desc: 'Publicaste 10 reviews',
    unlocked: true,
  },
  {
    icon: Heart,
    title: 'Ayudando a otros',
    desc: 'Tu contenido recibió 50 likes',
    unlocked: true,
  },
]

export function Achievements() {
  const unlocked = achievements.filter((a) => a.unlocked).length

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card/80 backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-foreground">
          Logros
        </h2>
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground">
          {unlocked} / {achievements.length}
        </span>
      </div>

      <ul className="flex flex-col">
        {achievements.map(({ icon: Icon, title, desc }) => (
          <li
            key={title}
            className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-secondary/60"
          >
            <span className="relative flex size-10 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-gradient-to-br from-primary/25 to-accent/15">
              <Icon className="size-4 text-primary" strokeWidth={1.5} />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-medium text-foreground">{title}</p>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
          </li>
        ))}
      </ul>

      {/* barra de progreso XP */}
      <div className="border-t border-border px-5 py-4">
        <div className="flex items-center justify-between font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
          <span>Nivel 02</span>
          <span>240 / 500 XP</span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
            style={{ width: '48%' }}
          />
        </div>
      </div>
    </div>
  )
}

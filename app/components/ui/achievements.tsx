import { Sparkles, Pen, Heart, type LucideIcon } from "lucide-react"

type Achievement = {
  icon: LucideIcon
  title: string
  desc: string
  unlocked: boolean
}

const achievements: Achievement[] = [
  {
    icon: Sparkles,
    title: "Primer review",
    desc: "¡Gracias por animarte!",
    unlocked: true,
  },
  {
    icon: Pen,
    title: "Reviewer activo",
    desc: "Publicaste 10 reviews",
    unlocked: true,
  },
  {
    icon: Heart,
    title: "Ayudando a otros",
    desc: "Tu contenido recibió 50 likes",
    unlocked: true,
  },
]

export function Achievements() {
  const unlocked = achievements.filter((a) => a.unlocked).length

  return (
    <div className="border-border bg-card/80 overflow-hidden rounded-2xl border backdrop-blur-sm">
      <div className="border-border flex items-center justify-between border-b px-5 py-4">
        <h2 className="text-foreground font-mono text-xs tracking-[0.18em] uppercase">Logros</h2>
        <span className="text-muted-foreground font-mono text-[0.7rem] tracking-[0.14em] uppercase">
          {unlocked} / {achievements.length}
        </span>
      </div>

      <ul className="flex flex-col">
        {achievements.map(({ icon: Icon, title, desc }) => (
          <li
            key={title}
            className="hover:bg-secondary/60 flex items-center gap-4 px-5 py-4 transition-colors"
          >
            <span className="border-primary/40 from-primary/25 to-accent/15 relative flex size-10 shrink-0 items-center justify-center rounded-full border bg-linear-to-br">
              <Icon className="text-primary size-4" strokeWidth={1.5} />
            </span>
            <div className="leading-tight">
              <p className="text-foreground text-sm font-medium">{title}</p>
              <p className="text-muted-foreground text-xs">{desc}</p>
            </div>
          </li>
        ))}
      </ul>

      {/* barra de progreso XP */}
      <div className="border-border border-t px-5 py-4">
        <div className="text-muted-foreground flex items-center justify-between font-mono text-[0.65rem] tracking-[0.14em] uppercase">
          <span>Nivel 02</span>
          <span>240 / 500 XP</span>
        </div>
        <div className="bg-secondary mt-2 h-1.5 w-full overflow-hidden rounded-full">
          <div
            className="from-primary to-accent h-full rounded-full bg-linear-to-r"
            style={{ width: "48%" }}
          />
        </div>
      </div>
    </div>
  )
}

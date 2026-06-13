import { Star, ThumbsUp, Check, BadgeCheck, Flame, Award } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { GradientAvatar } from "./gradient-avatar"
import { UserProfile } from "@/lib/api/dtos/responses/user"

type Stat = {
  icon: LucideIcon
  value: string
  label: string
}

const stats: Stat[] = [
  { icon: Check, value: "2", label: "Experiencias" },
  { icon: Star, value: "5", label: "Posteos" },
  { icon: Star, value: "4", label: "Comentarios" },
  { icon: ThumbsUp, value: "6 años", label: "Se unió" },
]

type UserBadge = {
  icon: LucideIcon
  label: string
}

const badges: UserBadge[] = [
  { icon: BadgeCheck, label: "Reviewer verificado" },
  { icon: Flame, label: "En racha" },
  { icon: Award, label: "Top aporte" },
]

export function ProfileSidebar({ user }: { user: UserProfile }) {
  return (
    <div className="border-border bg-card/80 overflow-hidden rounded-2xl border backdrop-blur-sm">
      {/* Encabezado con gradiente */}
      <div className="from-primary/20 via-accent/10 relative flex flex-col items-center gap-4 bg-linear-to-b to-transparent px-6 pt-8 pb-6 text-center">
        <div className="relative">
          <div
            className="from-primary to-accent absolute -inset-1 rounded-full bg-linear-to-tr opacity-70 blur-[6px]"
            aria-hidden="true"
          />
          <GradientAvatar seed={user.username} className="border-border relative size-24 border" />
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="text-foreground font-serif text-2xl font-medium tracking-tight">
            {user.username}
          </h1>
          <p className="text-muted-foreground font-mono text-xs tracking-[0.16em] uppercase">
            Diseño Gráfico
          </p>
        </div>

        {/* Badges de usuario */}
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          {badges.map(({ icon: Icon, label }) => (
            <span
              key={label}
              title={label}
              className="border-primary/30 bg-primary/10 text-primary inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.7rem]"
            >
              <Icon className="size-3" strokeWidth={2} />
              {label}
            </span>
          ))}
        </div>

        <p className="text-foreground/80 text-sm leading-relaxed text-pretty">{user.bio}</p>
      </div>

      {/* Stats grid */}
      <dl className="bg-border grid grid-cols-2 gap-px">
        {stats.map(({ icon: Icon, value, label }) => (
          <div
            key={label}
            className="bg-card hover:bg-secondary flex flex-col gap-3 p-5 transition-colors"
          >
            <Icon className="text-primary size-4" strokeWidth={1.5} aria-hidden="true" />
            <div className="flex flex-col gap-0.5">
              <dd className="text-foreground font-serif text-2xl leading-none font-medium">
                {value}
              </dd>
              <dt className="text-muted-foreground font-mono text-[0.65rem] tracking-[0.14em] uppercase">
                {label}
              </dt>
            </div>
          </div>
        ))}
      </dl>
    </div>
  )
}

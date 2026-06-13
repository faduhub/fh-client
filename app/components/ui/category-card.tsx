import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { ReactNode } from "react"

export function CategoryCard({
  icon,
  title,
  description,
  href,
}: {
  icon: ReactNode
  title: string
  description: string
  href: string
}) {
  return (
    <Link
      href={href}
      className="border-border bg-card/80 hover:border-primary/40 group relative flex flex-col gap-5 overflow-hidden rounded-2xl border p-6 backdrop-blur-sm transition-colors"
    >
      <div className="relative size-11">
        <div className="bg-primary/30 absolute inset-0 rounded-full blur-lg" />
        <div className="bg-primary/10 ring-primary/20 relative flex size-11 items-center justify-center rounded-xl ring-1">
          <span className="text-primary">{icon}</span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <h3 className="text-foreground text-lg font-semibold tracking-tight">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
      </div>

      <span className="text-primary group-hover:text-primary/70 mt-auto inline-flex items-center gap-1.5 font-mono text-[0.65rem] tracking-[0.15em] uppercase transition-colors">
        Explorar
        <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  )
}

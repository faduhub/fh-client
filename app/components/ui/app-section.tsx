import Link from "next/link"
import type { ReactNode } from "react"

export function AppSection({
  icon,
  title,
  subtitle,
  href,
  hrefLabel = "Ver todo",
  children,
}: {
  icon?: ReactNode
  title: string
  subtitle?: string
  href?: string
  hrefLabel?: string
  children: ReactNode
}) {
  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-foreground inline-flex items-center gap-2 text-xl font-semibold tracking-tight">
            {icon}
            {title}
          </h2>
          {subtitle && (
            <p className="text-muted-foreground mt-0.5 text-sm leading-relaxed">{subtitle}</p>
          )}
        </div>
        {href && (
          <Link
            href={href}
            className="text-primary hover:text-primary/70 mt-1 shrink-0 font-mono text-[0.65rem] tracking-[0.15em] uppercase transition-colors"
          >
            {hrefLabel} →
          </Link>
        )}
      </div>
      {children}
    </section>
  )
}

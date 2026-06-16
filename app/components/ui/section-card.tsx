import type { ReactNode } from "react"

export function SectionCard({
  title,
  description,
  icon,
  aside,
  children,
}: {
  title: string
  description?: string
  icon?: ReactNode
  aside?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="border-border bg-card/80 overflow-hidden rounded-2xl border backdrop-blur-sm">
      <div className="border-border flex items-start justify-between gap-4 border-b px-6 py-5">
        <div>
          <h2 className="text-foreground flex items-center gap-2 font-serif text-xl font-medium tracking-tight">
            {icon}
            {title}
          </h2>
          {description && (
            <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{description}</p>
          )}
        </div>
        {aside}
      </div>
      <div className="flex flex-col gap-6 p-6">{children}</div>
    </section>
  )
}

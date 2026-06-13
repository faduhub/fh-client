import type { ReactNode } from "react"

export function SectionCard({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <section className="border-border bg-card/80 overflow-hidden rounded-2xl border backdrop-blur-sm">
      <div className="border-border border-b px-6 py-5">
        <h2 className="text-foreground font-serif text-xl font-medium tracking-tight">{title}</h2>
        {description && (
          <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{description}</p>
        )}
      </div>
      <div className="flex flex-col gap-6 p-6">{children}</div>
    </section>
  )
}

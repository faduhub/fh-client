import type { ReactNode } from "react"

export function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <span className="text-muted-foreground font-mono text-[0.65rem] tracking-[0.18em] uppercase">
      {children}
    </span>
  )
}

import type { ReactNode } from "react"

export function FieldGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-6 sm:grid-cols-2">{children}</div>
}

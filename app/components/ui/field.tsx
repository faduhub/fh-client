import type { ReactNode } from "react"
import { FieldLabel } from "./field-label"

export function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string
  hint?: string
  required?: boolean
  children: ReactNode
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <FieldLabel>
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </FieldLabel>
      {children}
      {hint && <span className="text-muted-foreground/70 text-xs leading-relaxed">{hint}</span>}
    </label>
  )
}

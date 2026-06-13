import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

export function ToggleOptions<T extends string | boolean>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string; icon?: ReactNode }[]
  value: T | null
  onChange: (v: T) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors",
            value === opt.value
              ? "border-foreground bg-foreground text-background"
              : "border-border bg-secondary/40 text-muted-foreground hover:border-foreground/40 hover:text-foreground",
          )}
        >
          {opt.icon}
          {opt.label}
        </button>
      ))}
    </div>
  )
}

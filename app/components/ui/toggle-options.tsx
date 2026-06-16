import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

const sizeClass = {
  default: "px-4 py-2.5 text-sm",
  sm: "px-3 py-1.5 text-xs",
}

const variantClass = {
  solid: {
    active: "border-foreground bg-foreground text-background",
    inactive:
      "border-border bg-secondary/40 text-muted-foreground hover:border-foreground/40 hover:text-foreground",
  },
  outline: {
    active: "border-primary/50 bg-primary/10 text-primary",
    inactive:
      "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground",
  },
}

export function ToggleOptions<T extends string | boolean>({
  options,
  value,
  onChange,
  size = "default",
  variant = "solid",
}: {
  options: { value: T; label: string; icon?: ReactNode }[]
  value: T | null
  onChange: (v: T) => void
  size?: keyof typeof sizeClass
  variant?: keyof typeof variantClass
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl border font-medium transition-colors",
            sizeClass[size],
            value === opt.value ? variantClass[variant].active : variantClass[variant].inactive,
          )}
        >
          {opt.icon}
          {opt.label}
        </button>
      ))}
    </div>
  )
}

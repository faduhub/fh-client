import { cn } from "@/lib/utils"

export function ChipPicker<T extends string | number>({
  options,
  selected,
  onChange,
}: {
  options: { id: T; name: string }[]
  selected: T[]
  onChange: (id: T) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={String(opt.id)}
          type="button"
          onClick={() => onChange(opt.id)}
          className={cn(
            "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
            selected.includes(opt.id)
              ? "border-foreground bg-foreground text-background"
              : "border-border bg-secondary/40 text-muted-foreground hover:border-foreground/40 hover:text-foreground",
          )}
        >
          {opt.name}
        </button>
      ))}
    </div>
  )
}

import { cn } from "@/lib/utils"

type Props = {
  label: string
  value: number
}

export function Metric({ label, value }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
        {label}
      </span>
      <div className="flex items-center gap-1" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={cn("h-1.5 flex-1 rounded-full", i <= value ? "bg-foreground" : "bg-border")}
          />
        ))}
      </div>
    </div>
  )
}

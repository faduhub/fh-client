import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

export function StarRating({
  value,
  size = 14,
  className,
}: {
  value: number
  size?: number
  className?: string
}) {
  return (
    <div className={cn("flex items-center gap-0.5", className)} aria-label={`${value} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          width={size}
          height={size}
          className={cn(
            i <= Math.round(value) ? "fill-accent text-accent" : "fill-transparent text-border",
          )}
        />
      ))}
    </div>
  )
}

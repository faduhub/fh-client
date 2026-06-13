import Link from "next/link"
import { ThumbsUp } from "lucide-react"

export function DepartmentCard({
  name,
  slug,
  subjectName,
  recommendPct,
  reviewCount,
  label,
}: {
  name: string
  slug: string
  subjectName?: string
  recommendPct?: number
  reviewCount?: number
  label?: string
}) {
  return (
    <Link
      href={`/catedras/${slug}`}
      className="border-border bg-card/80 hover:border-primary/40 group flex flex-col gap-3 rounded-2xl border p-5 backdrop-blur-sm transition-colors"
    >
      {(subjectName || label) && (
        <div className="text-muted-foreground flex items-center gap-1.5 font-mono text-[0.65rem] tracking-[0.15em] uppercase">
          {label && <span className="text-accent">{label}</span>}
          {label && subjectName && <span className="text-muted-foreground/40">·</span>}
          {subjectName && <span>{subjectName}</span>}
        </div>
      )}

      <h3 className="text-foreground group-hover:text-accent text-base font-semibold tracking-tight transition-colors">
        {name}
      </h3>

      {(recommendPct !== undefined || reviewCount !== undefined) && (
        <div className="text-muted-foreground flex items-center gap-3 text-xs">
          {recommendPct !== undefined && (
            <span className="inline-flex items-center gap-1">
              <ThumbsUp className="size-3" strokeWidth={1.5} />
              {recommendPct}% recomendada
            </span>
          )}
          {recommendPct !== undefined && reviewCount !== undefined && (
            <span className="text-muted-foreground/30">·</span>
          )}
          {reviewCount !== undefined && <span>{reviewCount} experiencias</span>}
        </div>
      )}
    </Link>
  )
}

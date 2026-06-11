import Link from "next/link"
import { ArrowUpRight, Check } from "lucide-react"
import type { Review } from "@/lib/api/dtos/responses/review"
import { Badge } from "@/app/components/ui/badge"

type Props = {
  review: Pick<
    Review,
    "subject" | "department" | "departmentSlug" | "head" | "degree" | "recommends"
  >
}

export function ReviewCardHeader({ review }: Props) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-accent text-xs font-medium tracking-wider uppercase">{review.subject}</p>
        <Link
          href={`/catedra/${review.departmentSlug}`}
          className="text-foreground hover:text-accent relative z-10 mt-1 inline-flex items-center gap-1.5 text-2xl leading-tight font-semibold tracking-tight transition-colors"
        >
          {review.department}
          <ArrowUpRight className="text-muted-foreground size-4 opacity-0 transition-opacity group-hover:opacity-100" />
        </Link>
        <p className="text-muted-foreground mt-0.5 text-sm">
          {review.head} · {review.degree}
        </p>
      </div>
      <div>
        {review.recommends && (
          <div className="flex flex-col gap-1.5">
            <Badge variant="outline" className="bg-muted">
              <Check className="text-accent size-4" />
              <span className="text-accent"> Recomendada</span>
            </Badge>
          </div>
        )}
      </div>
    </header>
  )
}

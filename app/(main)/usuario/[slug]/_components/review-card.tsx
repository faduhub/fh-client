import { Star, ThumbsUp, MessageSquareQuote } from "lucide-react"
import { GradientAvatar } from "@/app/components/ui/gradient-avatar"

export type Review = {
  id: string
  subject: string
  catedra: string
  professor: string
  career: string
  rating: number
  body: string
  tags: string[]
  recommended: boolean
  author: string
  period: string
  time: string
  likes: number
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} de 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={
            i < Math.round(rating)
              ? "fill-primary text-primary size-3.5"
              : "text-muted-foreground size-3.5"
          }
          strokeWidth={1.5}
        />
      ))}
    </span>
  )
}

export function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="group border-border bg-card/80 hover:border-primary/40 relative overflow-hidden rounded-2xl border p-6 backdrop-blur-sm transition-colors sm:p-8">
      <div
        aria-hidden="true"
        className="via-primary/50 pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100"
      />
      <div className="flex items-start justify-between gap-4">
        <span className="text-primary font-mono text-xs tracking-[0.16em] uppercase">
          {review.subject}
        </span>
        {review.recommended && (
          <span className="border-primary/40 bg-primary/10 text-primary inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[0.7rem] tracking-[0.1em] uppercase">
            <ThumbsUp className="size-3" strokeWidth={2} />
            Recomendada
          </span>
        )}
      </div>

      <h3 className="text-foreground mt-3 font-serif text-2xl font-medium tracking-tight">
        {review.catedra}
      </h3>
      <p className="text-muted-foreground mt-1 text-sm">
        {review.professor} · {review.career}
      </p>

      <div className="mt-4 flex items-center gap-3">
        <RatingStars rating={review.rating} />
        <span className="text-foreground font-mono text-sm">{review.rating.toFixed(1)}</span>
      </div>

      <p className="text-foreground/90 mt-5 leading-relaxed text-pretty">{review.body}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {review.tags.map((tag) => (
          <span
            key={tag}
            className="border-border bg-secondary/60 text-secondary-foreground hover:border-primary/40 hover:text-foreground inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors"
          >
            <span
              aria-hidden="true"
              className="from-primary to-accent size-1.5 rounded-full bg-gradient-to-br"
            />
            {tag}
          </span>
        ))}
      </div>

      <div className="border-border mt-6 flex items-center justify-between border-t pt-5">
        <div className="flex items-center gap-3">
          <GradientAvatar seed={review.author} className="border-border size-9 border" />
          <div className="leading-tight">
            <p className="text-foreground text-sm">{review.author}</p>
            <p className="text-muted-foreground font-mono text-[0.7rem] tracking-[0.1em] uppercase">
              {review.period} · {review.time}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="border-border text-muted-foreground hover:border-primary/50 hover:text-foreground inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors"
          >
            <ThumbsUp className="size-4" strokeWidth={1.5} />
            {review.likes}
          </button>
          <button
            type="button"
            aria-label="Comentar"
            className="border-border text-muted-foreground hover:border-primary/50 hover:text-foreground inline-flex items-center justify-center rounded-full border p-2 transition-colors"
          >
            <MessageSquareQuote className="size-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </article>
  )
}

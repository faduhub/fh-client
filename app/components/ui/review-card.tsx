import { Star, ThumbsUp, MessageSquareQuote } from 'lucide-react'
import { GradientAvatar } from '@/components/gradient-avatar'

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
              ? 'size-3.5 fill-primary text-primary'
              : 'size-3.5 text-muted-foreground'
          }
          strokeWidth={1.5}
        />
      ))}
    </span>
  )
}

export function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border bg-card/80 p-6 backdrop-blur-sm transition-colors hover:border-primary/40 sm:p-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
      />
      <div className="flex items-start justify-between gap-4">
        <span className="font-mono text-xs uppercase tracking-[0.16em] text-primary">
          {review.subject}
        </span>
        {review.recommended && (
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-2.5 py-1 font-mono text-[0.7rem] uppercase tracking-[0.1em] text-primary">
            <ThumbsUp className="size-3" strokeWidth={2} />
            Recomendada
          </span>
        )}
      </div>

      <h3 className="mt-3 font-serif text-2xl font-medium tracking-tight text-foreground">
        {review.catedra}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {review.professor} · {review.career}
      </p>

      <div className="mt-4 flex items-center gap-3">
        <RatingStars rating={review.rating} />
        <span className="font-mono text-sm text-foreground">
          {review.rating.toFixed(1)}
        </span>
      </div>

      <p className="mt-5 text-pretty leading-relaxed text-foreground/90">
        {review.body}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {review.tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs text-secondary-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-gradient-to-br from-primary to-accent"
            />
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
        <div className="flex items-center gap-3">
          <GradientAvatar
            seed={review.author}
            className="size-9 border border-border"
          />
          <div className="leading-tight">
            <p className="text-sm text-foreground">{review.author}</p>
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.1em] text-muted-foreground">
              {review.period} · {review.time}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
          >
            <ThumbsUp className="size-4" strokeWidth={1.5} />
            {review.likes}
          </button>
          <button
            type="button"
            aria-label="Comentar"
            className="inline-flex items-center justify-center rounded-full border border-border p-2 text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
          >
            <MessageSquareQuote className="size-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </article>
  )
}

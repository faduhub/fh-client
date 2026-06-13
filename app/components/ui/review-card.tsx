import { ThumbsUp, MessageSquareQuote, ArrowUpRight } from "lucide-react"
import { GradientAvatar } from "./gradient-avatar"
import Link from "next/link"

export type Review = {
  id: string
  subject: string
  body: string
  department: string
  tags: string[]
  recommends: boolean
  author: string
  term: string
  period: string
  departmentSlug: string
  likes: number
  date: string
}

export function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="border-border bg-card/80 hover:border-primary/40 relative overflow-hidden rounded-2xl border p-6 backdrop-blur-sm transition-colors sm:p-8">
      <div
        aria-hidden="true"
        className="via-primary/50 pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100"
      />
      <div className="flex items-start justify-between gap-4">
        <Link
          href={`/catedras/${review.departmentSlug}`}
          className="group text-foreground hover:text-accent relative z-10 mt-1 inline-flex items-center gap-1.5 text-2xl leading-tight font-semibold tracking-tight transition-colors"
        >
          <span className="text-accent text-xs font-medium tracking-wider uppercase">
            {review.department}
          </span>
          <ArrowUpRight className="text-muted-foreground size-4 opacity-0 transition-opacity group-hover:opacity-100" />
        </Link>
        {review.recommends && (
          <span className="border-primary/40 bg-primary/10 text-primary inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[0.7rem] tracking-widest uppercase">
            <ThumbsUp className="size-3" strokeWidth={2} />
            Recomendada
          </span>
        )}
      </div>

      <Link
        href={`/catedras/${review.departmentSlug}`}
        className="text-foreground hover:text-accent group relative z-10 mt-1 inline-flex items-center gap-1.5 text-2xl leading-tight font-semibold tracking-tight transition-colors"
      >
        <h3 className="text-foreground hover:text-accent relative z-10 mt-1 inline-flex items-center gap-1.5 text-2xl leading-tight font-semibold tracking-tight transition-colors">
          {review.subject}
        </h3>
        <ArrowUpRight className="text-muted-foreground size-4 opacity-0 transition-opacity group-hover:opacity-100" />
      </Link>
      <p className="text-muted-foreground mt-0.5 text-sm">{review.term}</p>

      <p className="text-foreground/90 mt-5 text-sm leading-relaxed text-pretty">{review.body}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {review.tags.map((tag) => (
          <span
            key={tag}
            className="border-border bg-secondary/60 text-secondary-foreground hover:border-primary/40 hover:text-foreground inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors"
          >
            <span
              aria-hidden="true"
              className="from-primary to-accent size-1.5 rounded-full bg-linear-to-br"
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
            <p className="text-muted-foreground font-mono text-[0.7rem] tracking-widest uppercase">
              {review.date}
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

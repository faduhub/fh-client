"use client"

import { useState } from "react"
import Link from "next/link"
import { ThumbsUp, Check, X, ArrowUpRight } from "lucide-react"
import type { Review } from "@/lib/api"
import { StarRating } from "@/app/components/star-rating"
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar"
import { Badge } from "@/app/components/ui/badge"
import { cn } from "@/lib/utils"

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
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

export function ReviewCard({ review }: { review: Review }) {
  const [likes, setLikes] = useState(review.likes)
  const [liked, setLiked] = useState(false)

  function toggleLike() {
    setLikes((n) => (liked ? n - 1 : n + 1))
    setLiked((v) => !v)
  }

  return (
    <article className="group flex flex-col gap-5 border border-border bg-card p-6 transition-colors hover:border-foreground/30">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-accent">{review.subject}</p>
          <Link
            href={`/catedra/${review.departmentSlug}`}
            className="mt-1 inline-flex items-center gap-1.5 text-2xl font-semibold leading-tight tracking-tight text-foreground transition-colors hover:text-accent"
          >
            {review.department}
            <ArrowUpRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {review.head} · {review.degree}
          </p>
        </div>
        {review.rating != null && (
          <div className="flex flex-col items-end gap-1">
            <StarRating value={review.rating} size={16} />
            <span className="font-mono text-xs text-muted-foreground">{review.rating.toFixed(1)} / 5</span>
          </div>
        )}
      </header>

      <p className="text-pretty text-sm leading-relaxed text-foreground/90">{review.body}</p>

      {review.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {review.tags.map((t) => (
            <Badge key={t} variant="secondary" className="rounded-full font-normal">
              {t}
            </Badge>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-x-8 gap-y-4 border-y border-border py-4 sm:grid-cols-3">
        {review.workload != null && <Metric label="Carga horaria" value={review.workload} />}
        {review.difficulty != null && <Metric label="Dificultad" value={review.difficulty} />}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            ¿La recomienda?
          </span>
          <span
            className={cn(
              "inline-flex w-fit items-center gap-1 text-sm font-medium",
              review.recommends ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {review.recommends ? <Check className="size-4 text-accent" /> : <X className="size-4" />}
            {review.recommends ? "Sí" : "No"}
          </span>
        </div>
      </div>

      <footer className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <Avatar className="size-8">
            <AvatarFallback className="bg-secondary text-xs font-medium text-secondary-foreground">
              {review.initials}
            </AvatarFallback>
          </Avatar>
          <div className="leading-tight">
            <Link
              href={`/usuario/${review.authorSlug}`}
              className="text-sm font-medium text-foreground transition-colors hover:text-accent"
            >
              {review.author}
            </Link>
            <p className="text-xs text-muted-foreground">
              {review.term} · {review.date}
            </p>
          </div>
        </div>
        <button
          onClick={toggleLike}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
            liked
              ? "border-accent bg-accent text-accent-foreground"
              : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground",
          )}
          aria-pressed={liked}
        >
          <ThumbsUp className="size-3.5" />
          {likes}
        </button>
      </footer>
    </article>
  )
}

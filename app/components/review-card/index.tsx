"use client"

import { useState } from "react"
import Link from "next/link"
import type { Review } from "@/lib/api/dtos/responses/review"
import { Badge } from "@/app/components/ui/badge"
import { ReviewCardHeader } from "./header"
import { ReviewCardFooter } from "./footer"

export function ReviewCard({ review, linked = true }: { review: Review; linked?: boolean }) {
  const [likes, setLikes] = useState(review.likes)
  const [liked, setLiked] = useState(false)

  function toggleLike() {
    setLikes((n) => (liked ? n - 1 : n + 1))
    setLiked((v) => !v)
  }

  return (
    <article className="group border-border bg-card hover:border-foreground/30 relative flex flex-col gap-5 rounded-md border p-6 transition-colors">
      {/* Overlay link: makes the whole card navigate to the detail. Inner
          links/buttons sit above it via `relative z-10`. Disabled on the
          detail page itself, where it would self-link. */}
      {linked && (
        <Link
          href={`/resena/${review.id}`}
          className="absolute inset-0 rounded-md"
          aria-label={`Ver reseña de ${review.department}`}
        />
      )}

      <ReviewCardHeader review={review} />

      <p className="text-foreground/90 text-sm leading-relaxed text-pretty">{review.body}</p>

      {review.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {review.tags.map((t) => (
            <Badge key={t} variant="secondary" className="rounded-full font-normal">
              {t}
            </Badge>
          ))}
        </div>
      )}

      <ReviewCardFooter
        reviewId={review.id}
        author={review.author}
        authorSlug={review.authorSlug}
        initials={review.initials}
        term={review.term}
        date={review.date}
        likes={likes}
        liked={liked}
        onToggleLike={toggleLike}
      />
    </article>
  )
}

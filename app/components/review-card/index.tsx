"use client"

import { useState } from "react"
import type { Review } from "@/lib/api/dtos/responses/review"
import { Badge } from "@/app/components/ui/badge"
import { ReviewCardHeader } from "./header"
import { ReviewCardFooter } from "./footer"

export function ReviewCard({ review }: { review: Review }) {
  const [likes, setLikes] = useState(review.likes)
  const [liked, setLiked] = useState(false)

  function toggleLike() {
    setLikes((n) => (liked ? n - 1 : n + 1))
    setLiked((v) => !v)
  }

  return (
    <article className="group border-border bg-card hover:border-foreground/30 flex flex-col gap-5 rounded-md border p-6 transition-colors">
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

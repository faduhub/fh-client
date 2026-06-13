"use client"

import Link from "next/link"
import { ThumbsUp, MessageSquareQuoteIcon } from "lucide-react"
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar"
import { cn } from "@/lib/utils"

type Props = {
  reviewId: string
  author: string
  authorSlug: string
  initials: string
  term: string
  date: string
  likes: number
  liked: boolean
  onToggleLike: () => void
}

export function ReviewCardFooter({
  reviewId,
  author,
  authorSlug,
  initials,
  term,
  date,
  likes,
  liked,
  onToggleLike,
}: Props) {
  return (
    <footer className="border-boder flex items-center justify-between gap-4 border-t pt-4">
      <div className="flex items-center gap-2.5">
        <Avatar className="size-8">
          <AvatarFallback className="bg-secondary text-secondary-foreground text-xs font-medium">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="leading-tight">
          <Link
            href={`/usuario/${authorSlug}`}
            className="text-foreground hover:text-accent relative z-10 text-sm font-medium transition-colors"
          >
            {author}
          </Link>
          <p className="text-muted-foreground text-xs">
            {term} · {date}
          </p>
        </div>
      </div>
      <div className="space-x-3">
        <button
          onClick={onToggleLike}
          className={cn(
            "relative z-10 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
            liked
              ? "border-accent bg-accent text-accent-foreground"
              : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground",
          )}
          aria-pressed={liked}
        >
          <ThumbsUp className="size-3.5" />
          {likes}
        </button>
        <Link
          href={`/experiencias/${reviewId}#comentarios`}
          aria-label="Ver comentarios"
          className={cn(
            "relative z-10 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
            "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground",
          )}
        >
          <MessageSquareQuoteIcon className="size-3.5" />
        </Link>
      </div>
    </footer>
  )
}

"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ThumbsUp, MessageSquare } from "lucide-react"
import type { Post } from "@/lib/api/dtos/responses/post"
import { likePostAction, unlikePostAction } from "@/lib/api/actions/post.actions"
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar"
import { Badge } from "@/app/components/ui/badge"
import { Toast } from "@/app/components/ui/toast"
import { cn } from "@/lib/utils"

const boardTypeLabels: Record<string, string> = {
  CARRERA: "carrera",
  MATERIA: "materia",
  CATEDRA: "catedra",
}

type Props = {
  post: Post
  /** Si false, no renderiza el overlay de link al detalle (para la página de detalle). */
  linked?: boolean
  /** Me actual para detectar si es el autor. */
  meSlug?: string | null
}

export function PostCard({ post, linked = true, meSlug }: Props) {
  const [likes, setLikes] = useState(post.likes)
  const [liked, setLiked] = useState(post.likedByMe)
  const [, startTransition] = useTransition()
  const toast = Toast.useToastManager()
  const router = useRouter()

  function toggleLike(e: React.MouseEvent) {
    e.preventDefault()
    if (!meSlug) {
      router.push("/login")
      return
    }
    const next = !liked
    setLiked(next)
    setLikes((n) => n + (next ? 1 : -1))
    startTransition(async () => {
      const res = next ? await likePostAction(post.id) : await unlikePostAction(post.id)
      if (!res.success) {
        setLiked(!next)
        setLikes((n) => n + (next ? -1 : 1))
        toast.add({ title: "Error", description: res.error, type: "error" })
      }
    })
  }

  return (
    <article className="group border-border bg-card hover:border-foreground/30 relative flex flex-col gap-4 rounded-md border p-5 transition-colors">
      {linked && (
        <Link
          href={`/muros/${post.id}`}
          className="absolute inset-0 rounded-md"
          aria-label={`Ver post de ${post.author}`}
        />
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Avatar className="size-8 shrink-0">
            <AvatarFallback className="bg-secondary text-secondary-foreground text-xs font-medium">
              {post.initials}
            </AvatarFallback>
          </Avatar>
          <div className="leading-tight">
            <Link
              href={`/usuario/${post.authorSlug}`}
              className="text-foreground hover:text-accent relative z-10 text-sm font-medium transition-colors"
            >
              @{post.author}
            </Link>
            <p className="text-muted-foreground text-xs">
              {post.date}
              {post.edited && <span className="italic"> · editado</span>}
            </p>
          </div>
        </div>

        {post.board && (
          <Link
            href={`/${boardTypeLabels[post.boardType] ?? post.boardType.toLowerCase()}/${post.board.slug}`}
            className="relative z-10"
          >
            <Badge variant="secondary" className="rounded-full font-normal">
              {post.board.name}
            </Badge>
          </Link>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1.5">
        {post.title && (
          <h3 className="text-foreground text-base leading-snug font-semibold">{post.title}</h3>
        )}
        <p className="text-foreground/85 text-sm leading-relaxed text-pretty">{post.body}</p>
      </div>

      {/* Footer */}
      <footer className="border-border flex items-center gap-3 border-t pt-3">
        <button
          onClick={toggleLike}
          aria-pressed={liked}
          className={cn(
            "relative z-10 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
            liked
              ? "border-accent bg-accent text-accent-foreground"
              : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground",
          )}
        >
          <ThumbsUp className="size-3.5" />
          {likes}
        </button>

        <Link
          href={`/muros/${post.id}#comentarios`}
          className={cn(
            "relative z-10 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
            "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground",
          )}
        >
          <MessageSquare className="size-3.5" />
          {post.commentsCount > 0 ? post.commentsCount : null}
        </Link>
      </footer>
    </article>
  )
}

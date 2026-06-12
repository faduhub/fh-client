"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ThumbsUp, MessageSquare } from "lucide-react"
import type { Post } from "@/lib/api/dtos/responses/post"
import type { Comment } from "@/lib/api/dtos/responses/comment"
import { likePostAction, unlikePostAction } from "@/lib/api/actions/post.actions"
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar"
import { Badge } from "@/app/components/ui/badge"
import { Toast } from "@/app/components/ui/toast"
import { PostActions } from "./post-actions"
import { PostCommentSection } from "./post-comment-section"
import { cn } from "@/lib/utils"

const boardTypeLabels: Record<string, string> = {
  CARRERA: "carrera",
  MATERIA: "materia",
  CATEDRA: "catedra",
}

type Props = {
  initialPost: Post
  initialComments: Comment[]
  meSlug?: string | null
}

export function PostDetail({ initialPost, initialComments, meSlug }: Props) {
  const [post, setPost] = useState(initialPost)
  const [likes, setLikes] = useState(post.likes)
  const [liked, setLiked] = useState(post.likedByMe)
  const [, startTransition] = useTransition()
  const toast = Toast.useToastManager()
  const router = useRouter()

  const isAuthor = !!meSlug && meSlug === post.authorSlug

  function toggleLike() {
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
    <div className="flex flex-col gap-10">
      <article className="border-border bg-card flex flex-col gap-5 rounded-md border p-6">
        {/* Board badge */}
        {post.board && (
          <Link
            href={`/${boardTypeLabels[post.boardType] ?? post.boardType.toLowerCase()}/${post.board.slug}`}
          >
            <Badge variant="secondary" className="rounded-full font-normal">
              {post.board.name}
            </Badge>
          </Link>
        )}

        {/* Title */}
        {post.title && (
          <h1 className="text-foreground text-2xl leading-snug font-bold tracking-tight">
            {post.title}
          </h1>
        )}

        {/* Author row */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Avatar className="size-8 shrink-0">
              <AvatarFallback className="bg-secondary text-secondary-foreground text-xs font-medium">
                {post.initials}
              </AvatarFallback>
            </Avatar>
            <div className="leading-tight">
              <Link
                href={`/usuario/${post.authorSlug}`}
                className="text-foreground hover:text-accent text-sm font-medium transition-colors"
              >
                @{post.author}
              </Link>
              <p className="text-muted-foreground text-xs">
                {post.date}
                {post.edited && <span className="italic"> · editado</span>}
              </p>
            </div>
          </div>
          {isAuthor && <PostActions post={post} onUpdate={setPost} />}
        </div>

        {/* Body */}
        <p className="text-foreground/90 text-base leading-relaxed text-pretty">{post.body}</p>

        {/* Footer */}
        <footer className="border-border flex items-center gap-3 border-t pt-4">
          <button
            onClick={toggleLike}
            aria-pressed={liked}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              liked
                ? "border-accent bg-accent text-accent-foreground"
                : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground",
            )}
          >
            <ThumbsUp className="size-3.5" />
            {likes}
          </button>
          <a
            href="#comentarios"
            className="border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors"
          >
            <MessageSquare className="size-3.5" />
            {post.commentsCount > 0 ? post.commentsCount : "Comentar"}
          </a>
        </footer>
      </article>

      <PostCommentSection postId={post.id} initialComments={initialComments} meSlug={meSlug} />
    </div>
  )
}

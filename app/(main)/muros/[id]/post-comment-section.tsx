"use client"

import type { Comment } from "@/lib/api/dtos/responses/comment"
import { useCommentList } from "@/lib/hooks/use-comment-list"
import { CommentCard } from "@/app/components/comment-card"
import { CommentComposer } from "@/app/components/comment-composer"

type Props = {
  postId: string
  initialComments?: Comment[]
  meSlug?: string | null
}

export function PostCommentSection({ postId, initialComments = [], meSlug }: Props) {
  const source = { sourceType: "POST" as const, sourceId: postId }
  const { comments, isPending, add, remove, edit } = useCommentList(source, initialComments)
  const total = comments.reduce((n, c) => n + 1 + c.repliesCount, 0)

  return (
    <section id="comentarios" className="flex flex-col gap-6">
      <h2 className="text-foreground text-lg font-semibold tracking-tight">
        Comentarios <span className="text-muted-foreground font-normal">({total})</span>
      </h2>

      {meSlug ? (
        <CommentComposer onSubmit={(text) => add(text)} pending={isPending} />
      ) : (
        <p className="text-muted-foreground border-border rounded-md border border-dashed py-4 text-center text-sm">
          <a href="/login" className="text-accent font-medium underline underline-offset-4">
            Iniciá sesión
          </a>{" "}
          para dejar un comentario.
        </p>
      )}

      {comments.length > 0 ? (
        <ul className="flex flex-col gap-3">
          {comments.map((c) => (
            <CommentCard key={c.id} comment={c} source={source} onEdit={edit} onDelete={remove} />
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground rounded-md border border-dashed py-10 text-center text-sm">
          Todavía no hay comentarios. Sé el primero en dejar uno.
        </p>
      )}
    </section>
  )
}

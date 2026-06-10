"use client"

import type { Comment } from "@/lib/api/dtos/responses/comment"
import { useCommentList } from "@/lib/hooks/use-comment-list"
import { CommentCard } from "@/app/components/comment-card"
import { CommentComposer } from "@/app/components/comment-composer"

type Props = {
  reviewId: string
  initialComments?: Comment[]
}

export function CommentSection({ reviewId, initialComments = [] }: Props) {
  const { comments, isPending, add, remove, edit } = useCommentList(reviewId, initialComments)
  const total = comments.reduce((n, c) => n + 1 + c.repliesCount, 0)

  return (
    <section id="comentarios" className="flex flex-col gap-6">
      <h2 className="text-foreground text-lg font-semibold tracking-tight">
        Comentarios <span className="text-muted-foreground font-normal">({total})</span>
      </h2>

      <CommentComposer onSubmit={(text) => add(text)} pending={isPending} />

      {comments.length > 0 ? (
        <ul className="flex flex-col gap-3">
          {comments.map((c) => (
            <CommentCard
              key={c.id}
              comment={c}
              reviewId={reviewId}
              onEdit={edit}
              onDelete={remove}
            />
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

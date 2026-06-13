import Link from "next/link"
import type { BoardType } from "@/lib/api/dtos/responses/post"
import type { Paginated } from "@/lib/api/dtos/responses/pagination"
import type { Post } from "@/lib/api/dtos/responses/post"
import { PostCard } from "@/app/components/post-card"

type Props = {
  result: Paginated<Post>
  boardType: BoardType
  boardId: string
  meSlug?: string | null
}

export function BoardPostsFeed({ result, boardType, boardId, meSlug }: Props) {
  return (
    <div className="flex flex-col gap-4">
      {result.data.length > 0 ? (
        <div className="flex flex-col gap-4">
          {result.data.map((p) => (
            <PostCard key={p.id} post={p} meSlug={meSlug} />
          ))}
        </div>
      ) : (
        <div className="border-border border border-dashed py-12 text-center">
          <p className="text-foreground font-semibold">Sin posts en este muro</p>
          <p className="text-muted-foreground mt-1 text-sm">Sé el primero en publicar algo.</p>
          {meSlug && (
            <Link
              href={`/muros/nuevo?boardType=${boardType}&boardId=${boardId}`}
              className="text-accent mt-3 inline-block text-sm font-medium underline underline-offset-4"
            >
              Crear post
            </Link>
          )}
        </div>
      )}

      {result.numberOfPages > 1 && (
        <p className="text-muted-foreground text-center text-sm">
          Ver todos en{" "}
          <Link href="/muros" className="text-accent underline underline-offset-4">
            Muros
          </Link>
        </p>
      )}
    </div>
  )
}

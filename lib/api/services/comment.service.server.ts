import { http } from "@/lib/api/http.server"
import type { Comment } from "@/lib/api/dtos/responses/comment"
import type { Paginated } from "@/lib/api/dtos/responses/pagination"

export type GetCommentsParams = {
  page?: number
  limit?: number
  order?: "ASC" | "DESC"
  orderBy?: string
}

const EMPTY: Paginated<Comment> = {
  total: 0,
  currentPage: 1,
  nextPage: null,
  prevPage: null,
  numberOfPages: 0,
  limit: null,
  data: [],
}

// auth: true reenvía la cookie de sesión → el backend puede devolver `likedByMe`.
// Como la respuesta es per-user, no se cachea (no-store).
const READ = { auth: true, cache: "no-store" } as const

export const commentService = {
  /**
   * Comentarios top-level de una review (ordenados por likes por defecto).
   * GET /v1/comments?sourceType=REVIEW&sourceId=<uuid>
   */
  async getByReview(reviewId: string, params?: GetCommentsParams): Promise<Paginated<Comment>> {
    const qs = new URLSearchParams({ sourceType: "REVIEW", sourceId: reviewId })
    qs.set("orderBy", params?.orderBy ?? "likes")
    if (params?.page) qs.set("page", String(params.page))
    if (params?.limit) qs.set("limit", String(params.limit))
    if (params?.order) qs.set("order", params.order)

    try {
      return await http.getPaginated<Comment>(`/comments?${qs}`, READ)
    } catch {
      return EMPTY
    }
  },

  /**
   * Comentarios top-level de un post.
   * GET /v1/comments?sourceType=POST&sourceId=<uuid>
   */
  async getByPost(postId: string, params?: GetCommentsParams): Promise<Paginated<Comment>> {
    const qs = new URLSearchParams({ sourceType: "POST", sourceId: postId })
    qs.set("orderBy", params?.orderBy ?? "likes")
    if (params?.page) qs.set("page", String(params.page))
    if (params?.limit) qs.set("limit", String(params.limit))
    if (params?.order) qs.set("order", params.order)

    try {
      return await http.getPaginated<Comment>(`/comments?${qs}`, READ)
    } catch {
      return EMPTY
    }
  },

  /**
   * Respuestas de un comment top-level (orden cronológico ASC por defecto).
   * GET /v1/comments?parentId=<commentId>
   */
  async getReplies(parentId: string, params?: GetCommentsParams): Promise<Paginated<Comment>> {
    const qs = new URLSearchParams({ parentId })
    if (params?.page) qs.set("page", String(params.page))
    if (params?.limit) qs.set("limit", String(params.limit))
    if (params?.order) qs.set("order", params.order)
    if (params?.orderBy) qs.set("orderBy", params.orderBy)

    try {
      return await http.getPaginated<Comment>(`/comments?${qs}`, READ)
    } catch {
      return EMPTY
    }
  },
}

import { http } from "@/lib/api/http.server"
import type { Post } from "@/lib/api/dtos/responses/post"
import type { BoardType } from "@/lib/api/dtos/responses/post"
import type { Paginated } from "@/lib/api/dtos/responses/pagination"

export type GetPostsParams = {
  boardType?: BoardType
  boardId?: string
  orderBy?: "likes"
  order?: "ASC" | "DESC"
  search?: string
  page?: number
  limit?: number
}

const READ = { auth: true, cache: "no-store" } as const

export const postService = {
  async getPosts(params: GetPostsParams = {}): Promise<Paginated<Post>> {
    const qs = new URLSearchParams()
    if (params.boardType) qs.set("boardType", params.boardType)
    if (params.boardId) qs.set("boardId", params.boardId)
    if (params.orderBy) qs.set("orderBy", params.orderBy)
    if (params.order) qs.set("order", params.order)
    if (params.search) qs.set("search", params.search)
    if (params.page) qs.set("page", String(params.page))
    if (params.limit) qs.set("limit", String(params.limit))
    return http.getPaginated<Post>(`/posts?${qs}`, READ)
  },

  async getById(id: string): Promise<Post> {
    return http.get<Post>(`/posts/${id}`, READ)
  },
}

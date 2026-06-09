import { fetcher } from "@/lib/api/fetcher.server"
import type { Review } from "@/lib/api/dtos/responses/review"

export type GetReviewsParams = {
  search?: string
  degreeSlug?: string
  departmentSlug?: string
  orderBy?: string
  order?: "ASC" | "DESC"
}

export const reviewService = {
  async getAll(params?: GetReviewsParams): Promise<Review[]> {
    const qs = new URLSearchParams()
    if (params?.search) qs.set("search", params.search)
    if (params?.degreeSlug) qs.set("degreeSlug", params.degreeSlug)
    if (params?.departmentSlug) qs.set("departmentSlug", params.departmentSlug)
    if (params?.orderBy) qs.set("orderBy", params.orderBy)
    if (params?.order) qs.set("order", params.order)

    return fetcher.get<Review[]>(`/reviews?${qs}`, {
      next: { tags: ["reviews"], revalidate: 60 },
    })
  },
}

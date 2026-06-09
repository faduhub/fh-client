import { fetcher } from "@/lib/api/fetcher.server"
import type { TagItem } from "@/lib/api/dtos/responses/tag"

export const tagService = {
  async getAll(): Promise<TagItem[]> {
    try {
      return await fetcher.get<TagItem[]>("/tags", {
        next: { tags: ["tags"], revalidate: 3600 },
      })
    } catch {
      return []
    }
  },
}

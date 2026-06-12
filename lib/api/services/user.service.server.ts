import { fetcher } from "@/lib/api/fetcher.server"
import type { UserProfile } from "@/lib/api/dtos/responses/user"

export const userService = {
  async getBySlug(slug: string): Promise<UserProfile | null> {
    try {
      return await fetcher.get<UserProfile>(`/users/${slug}`, {
        next: { tags: [`user-${slug}`] },
      })
    } catch {
      return null
    }
  },
}

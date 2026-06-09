import { fetcher } from "@/lib/api/fetcher.server"
import type { DepartmentStats } from "@/lib/api/dtos/responses/department"

export const departmentService = {
  async getAll(): Promise<DepartmentStats[]> {
    return fetcher.get<DepartmentStats[]>("/catedras", {
      next: { tags: ["departments"], revalidate: 60 },
    })
  },

  async getBySlug(slug: string): Promise<DepartmentStats | null> {
    try {
      return await fetcher.get<DepartmentStats>(`/catedras/${slug}`, {
        next: { tags: [`department-${slug}`] },
      })
    } catch {
      return null
    }
  },
}

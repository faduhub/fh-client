import { fetcher } from "@/lib/api/fetcher.server"
import type { SubjectItem } from "@/lib/api/dtos/responses/subject"

export const subjectService = {
  async getAll(): Promise<SubjectItem[]> {
    return fetcher.get<SubjectItem[]>("/materias", {
      next: { tags: ["subjects"], revalidate: 3600 },
    })
  },
}

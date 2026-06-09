import { fetcher } from "@/lib/api/fetcher.server"
import type { DegreeItem } from "@/lib/api/dtos/responses/degree"

export const degreeService = {
  async getAll(): Promise<DegreeItem[]> {
    return fetcher.get<DegreeItem[]>("/carreras", {
      next: { tags: ["degrees"], revalidate: 3600 },
    })
  },
}

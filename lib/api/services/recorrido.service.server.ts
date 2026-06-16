import { ApiError, http } from "@/lib/api/http.server"
import type { Recorrido } from "@/lib/api/dtos/responses/recorrido"

const READ = { auth: true, cache: "no-store" } as const

export const recorridoService = {
  async get(degreeId?: string): Promise<Recorrido | null> {
    try {
      const query = degreeId ? `?degreeId=${encodeURIComponent(degreeId)}` : ""

      return await http.get<Recorrido>(`/users/me/recorrido${query}`, READ)
    } catch (error) {
      if (error instanceof ApiError) {
        return null
      }

      throw error
    }
  },
}

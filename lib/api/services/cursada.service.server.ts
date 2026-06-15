import { http } from "@/lib/api/http.server"
import { Cursada } from "@/lib/api/dtos/responses/cursada"

// Read autenticado y per-user (endpoint 🔒): no se puede cachear por tag
// (mismo criterio que `accountService.getMe`). `auth` reenvía la cookie de
// sesión; `no-store` evita servir las cursadas de otro usuario desde el cache.
const READ = { auth: true, cache: "no-store" } as const

export const cursadasService = {
  /** Cursadas del usuario logueado. */
  async getAll(): Promise<Cursada[]> {
    return http.get<Cursada[]>("/cursadas", READ)
  },
}

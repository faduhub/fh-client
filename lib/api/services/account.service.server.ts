import { cache } from "react"
import { http } from "@/lib/api/http.server"
import type { Me } from "@/lib/api/dtos/responses/me"

// Reads autenticados y per-user: no se pueden cachear por tag (igual criterio que
// `likedByMe` en comments). `auth` reenvía la cookie de sesión; `no-store` evita
// servir la identidad de otro usuario desde el cache.
const READ = { auth: true, cache: "no-store" } as const

export const accountService = {
  /**
   * Identidad + preferencias del usuario logueado. null si no hay sesión (401).
   * `cache()` (de React) deduplica la llamada dentro de un mismo request: el guard
   * del layout y la página la comparten sin doble fetch.
   */
  getMe: cache(async (): Promise<Me | null> => {
    try {
      return await http.get<Me>("/users/me", READ)
    } catch {
      return null
    }
  }),

  /** Disponibilidad de un username. Formato inválido o error => false. */
  async isUsernameAvailable(username: string): Promise<boolean> {
    try {
      // Tolerante a ambas formas durante la transición de envelope:
      // hoy `{ available }` en la raíz; post-PR `{ data: { available } }`.
      const res = await http.getRaw<{ available?: boolean; data?: { available: boolean } }>(
        `/users/username-available?username=${encodeURIComponent(username)}`,
        READ,
      )
      return res.data?.available ?? res.available ?? false
    } catch {
      return false
    }
  },
}

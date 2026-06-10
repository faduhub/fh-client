"use server"

import { cookies } from "next/headers"
import { action } from "@/lib/api/action.server"
import { http } from "@/lib/api/http.server"
import { accountService } from "@/lib/api/services/account.service.server"
import type { UpdateProfilePayload } from "@/lib/api/dtos/payloads/account"
import type { Me } from "@/lib/api/dtos/responses/me"

/** Cookie que marca que el usuario salteó el onboarding (no trapped por el guard). */

// PATCH devuelve el recurso actualizado bajo `data` (envelope canónico). Hasta que
// caiga el PR de estandarización, `data` puede venir undefined: el form igual puede
// caer a `getMe()` si lo necesita.

/** Edita perfil. Los límites (nombre ≤50, bio ≤280) los valida el backend. */
export async function updateProfileAction(payload: UpdateProfilePayload) {
  return action(() => http.patch<Me>("/users/me", { body: payload, auth: true }))
}

/**
 * Cambia el username. Devuelve el `Me` actualizado (con el nuevo `canChangeUsernameAt`).
 * Errores de negocio por `code`: USERNAME_TAKEN (409), USERNAME_COOLDOWN (400),
 * USERNAME_INVALID (400).
 */
export async function changeUsernameAction(username: string) {
  return action(() => http.patch<Me>("/users/me/username", { body: { username }, auth: true }))
}

/** Disponibilidad para validación en vivo (onboarding/settings). */
export async function checkUsernameAction(username: string) {
  return action(() => accountService.isUsernameAvailable(username))
}

/**
 * Saltea el onboarding por esta sesión (cookie sin maxAge → se borra al cerrar el
 * browser). El guard del layout `(main)` la respeta para no atrapar al usuario.
 */
export async function dismissOnboardingAction() {
  ; (await cookies()).set("fh_onboarding_skipped", "1", { sameSite: "lax", path: "/" })
}

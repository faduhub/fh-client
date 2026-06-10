import { ApiError } from "@/lib/api/http.server"

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string }

/**
 * Envuelve la lógica de una Server Action: ejecuta `fn`, devuelve su resultado
 * como `ActionResult` y mapea cualquier `ApiError` al mensaje del backend.
 */
export async function action<T>(fn: () => Promise<T>): Promise<ActionResult<T>> {
  try {
    return { success: true, data: await fn() }
  } catch (e) {
    const error = e instanceof ApiError ? e.message : "Algo salió mal. Intentá de nuevo."
    return { success: false, error }
  }
}

import { ApiError } from "@/lib/api/http.server"

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string }

/**
 * Envuelve la lógica de una Server Action: ejecuta `fn`, devuelve su resultado
 * como `ActionResult` y mapea cualquier `ApiError` a `error` (mensaje humano) +
 * `code` (código estable para ramificar la UI).
 */
export async function action<T>(fn: () => Promise<T>): Promise<ActionResult<T>> {
  try {
    return { success: true, data: await fn() }
  } catch (e) {
    if (e instanceof ApiError) {
      return { success: false, error: e.message, code: e.code }
    }
    return { success: false, error: "Algo salió mal. Intentá de nuevo." }
  }
}

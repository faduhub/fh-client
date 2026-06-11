import { useEffect, useRef, useState } from "react"
import { checkUsernameAction } from "@/lib/api/actions/account.actions"

/** Espeja la regla del backend: 3–20, minúsculas, números y guión bajo. */
export const USERNAME_RE = /^[a-z0-9_]{3,20}$/

export type UsernameStatus = "idle" | "invalid" | "checking" | "available" | "taken"

const MESSAGE: Record<UsernameStatus, string> = {
  idle: "",
  invalid: "3 a 20 caracteres: minúsculas, números o guión bajo.",
  checking: "Verificando…",
  available: "Disponible",
  taken: "Ese username ya está tomado.",
}

const DEBOUNCE_MS = 300

/**
 * Validación en vivo de username: regex en cliente + disponibilidad con debounce.
 * Ignora respuestas stale si el usuario sigue tipeando. `initial` se considera el
 * username actual y no se chequea (status `idle`).
 */
export function useUsernameCheck(initial = "") {
  const [value, setValue] = useState(initial)
  const [status, setStatus] = useState<UsernameStatus>("idle")
  const reqId = useRef(0)

  useEffect(() => {
    const v = value.trim()

    // Sin cambios respecto al actual, o vacío: nada que validar.
    if (v === initial || v === "") {
      ;(() => setStatus("idle"))()
      return
    }

    if (!USERNAME_RE.test(v)) {
      ;(() => setStatus("invalid"))()
      return
    }

    ;(() => {
      setStatus("checking")
    })()
    const id = ++reqId.current
    const t = setTimeout(async () => {
      const res = await checkUsernameAction(v)
      if (id !== reqId.current) return // llegó una respuesta vieja: descartar
      if (!res.success) {
        setStatus("invalid")
        return
      }
      setStatus(res.data ? "available" : "taken")
    }, DEBOUNCE_MS)

    return () => clearTimeout(t)
  }, [value, initial])

  return { value, setValue, status, message: MESSAGE[status] }
}

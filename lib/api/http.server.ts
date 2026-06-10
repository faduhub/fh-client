import { headers } from "next/headers"
import type { Paginated } from "@/lib/api/dtos/responses/pagination"

const getBase = () => {
  const url = process.env.API_URL
  if (!url) throw new Error("API_URL env var is not set")
  return `${url}/v1`
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

type RequestOptions = Omit<RequestInit, "body" | "method"> & {
  /** JSON body — se serializa y setea el Content-Type automáticamente. */
  body?: unknown
  /** Reenvía la cookie de sesión de la request entrante (endpoints 🔒). */
  auth?: boolean
}

async function rawRequest(method: string, path: string, opts: RequestOptions = {}) {
  const { body, auth, headers: extraHeaders, ...rest } = opts
  const cookie = auth ? ((await headers()).get("cookie") ?? "") : ""

  const res = await fetch(`${getBase()}${path}`, {
    method,
    ...(auth ? { credentials: "include" as const } : {}),
    headers: {
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(auth ? { cookie } : {}),
      ...extraHeaders,
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    ...rest,
  })

  const json = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new ApiError(res.status, json.message ?? `API error ${res.status}`)
  }
  return json as Record<string, unknown>
}

/** Devuelve el `data` desempaquetado del envelope `{ success, data }`. */
async function request<T>(method: string, path: string, opts?: RequestOptions): Promise<T> {
  const json = await rawRequest(method, path, opts)
  return json.data as T
}

export const http = {
  get: <T>(path: string, opts?: RequestOptions) => request<T>("GET", path, opts),
  post: <T>(path: string, opts?: RequestOptions) => request<T>("POST", path, opts),
  patch: <T>(path: string, opts?: RequestOptions) => request<T>("PATCH", path, opts),
  del: <T>(path: string, opts?: RequestOptions) => request<T>("DELETE", path, opts),

  /** GET que conserva la metadata de paginación (`total`, `currentPage`, …). */
  getPaginated: async <T>(path: string, opts?: RequestOptions): Promise<Paginated<T>> => {
    const json = await rawRequest("GET", path, opts)
    return json as unknown as Paginated<T>
  },
}

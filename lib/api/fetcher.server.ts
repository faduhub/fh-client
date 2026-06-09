export const BASE = `${process.env.API_URL}/v1`

type ListResponse<T> = { data: T[] }
type SingleResponse<T> = { data: T }

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, init)
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`)
  const json: ListResponse<T> | SingleResponse<T> = await res.json()
  return (json as SingleResponse<T>).data
}

export const fetcher = {
  get<T>(path: string, init?: Omit<RequestInit, "method">) {
    return request<T>(path, init)
  },
}

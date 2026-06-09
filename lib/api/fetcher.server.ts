const getBase = () => {
  const url = process.env.API_URL
  if (!url) throw new Error("API_URL env var is not set")
  return `${url}/v1`
}

/** @deprecated use fetcher.get — this is only exported for Server Actions */
export const BASE = getBase

type ListResponse<T> = { data: T[] }
type SingleResponse<T> = { data: T }

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${getBase()}${path}`, init)
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`)
  const json: ListResponse<T> | SingleResponse<T> = await res.json()
  return (json as SingleResponse<T>).data
}

export const fetcher = {
  get<T>(path: string, init?: Omit<RequestInit, "method">) {
    return request<T>(path, init)
  },
}

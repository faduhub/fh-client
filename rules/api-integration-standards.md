# API Integration Standards - FRONTEND

> **CRITICAL**: This document outlines mandatory patterns for API integration in a **Next.js App Router + Express** stack.

---

## Architecture Overview

Next.js App Router introduces a split execution model. API integration follows two distinct paths:

```
Server Component  →  Server Service       →  Express API   (SSR, Next.js cache)
Client Component  →  Server Action        →  Express API   (mutations, session forwarding)
Client Component  →  Client Service       →  Express API   (real-time, optimistic UI only)
```

The key principle: **data fetching lives on the server by default**. Client-side fetching is the exception, not the rule.

---

## Directory Structure

```
app/
  api/
    dtos/
      ├── catedra.ts          # Response types
      ├── review.ts
      ├── carrera.ts
      └── payloads/
          ├── review.ts       # Request body types
          └── auth.ts
    services/
      ├── catedra.service.server.ts   # Server Components only
      ├── review.service.client.ts    # Client Components only
      └── ...
    actions/
      ├── review.actions.ts   # Server Actions (mutations)
      └── auth.actions.ts
```

---

## 🚨 MANDATORY RULES

### ✅ ALWAYS DO

- **Centralize types** in `/api/dtos/` — never define API types inline in components
- **Use `type`** for all DTO definitions — never `interface`
- **Use union types** instead of enums
- **Server Components fetch via server services** — never `useEffect` + fetch for initial data
- **Mutations go through Server Actions** — never call the Express API directly from a Client Component unless you need optimistic updates or real-time behavior
- **Forward session cookies in Server Actions** via `headers()` from `next/headers`
- **Invalidate cache with `revalidateTag`** after mutations — never rely on manual refetch
- **Handle loading and error states** consistently
- **Keep `NEXT_PUBLIC_API_URL` out of server services** — use `process.env.API_URL` (server-only)

### ❌ NEVER DO

- Define API types inline in components
- Call the Express API directly from a Client Component for initial page data
- Use `interface` for API type definitions
- Use enums in API types
- Expose the backend URL to the client unless strictly necessary
- Skip error handling or loading states
- Use `credentials: "include"` in client fetches — session forwarding belongs in Server Actions

---

## 1. DTOs

Shared between server and client. No `"use server"` or `"use client"` directive.

### Response Types

```typescript
// app/api/dtos/catedra.ts
export type CatedraStats = {
  id: number
  slug: string
  catedra: string
  titular: string
  materias: string[]
  carreras: string[]
  rating: number
  cargaHoraria: number
  dificultad: number
  recomiendaPct: number
  totalLikes: number
  reviews: Review[]
}
```

### Payload Types (Request Bodies)

```typescript
// app/api/dtos/payloads/review.ts
export type CreateReviewPayload = {
  catedraId: number
  materiaId?: number
  carreraId?: number
  rating: number
  cargaHoraria: number
  dificultad: number
  recomienda: boolean
  texto: string
  anio: number
  periodo: "PRIMERO" | "SEGUNDO" | "VERANO"
  tagIds?: number[]
}
```

---

## 2. Server Services

Used **only** in Server Components and Server Actions. Never imported in Client Components.

- Use `process.env.API_URL` (not `NEXT_PUBLIC_`)
- Use `next: { revalidate }` or `next: { tags }` for Next.js cache control
- Never include `credentials` or cookie handling here — that belongs in Server Actions

```typescript
// app/api/services/catedra.service.server.ts
import type { CatedraStats } from "@/api/dtos/catedra"

const API = process.env.API_URL!

export const catedraService = {
  async getAll(): Promise<CatedraStats[]> {
    const res = await fetch(`${API}/v1/catedras`, {
      next: { tags: ["catedras"], revalidate: 60 },
    })
    if (!res.ok) throw new Error(`API error ${res.status}`)
    const json = await res.json()
    return json.data
  },

  async getBySlug(slug: string): Promise<CatedraStats | null> {
    const res = await fetch(`${API}/v1/catedras/${slug}`, {
      next: { tags: [`catedra-${slug}`] },
    })
    if (!res.ok) return null
    const json = await res.json()
    return json.data
  },
}
```

Usage in a Server Component:

```typescript
// app/catedras/page.tsx
import { catedraService } from "@/api/services/catedra.service.server"

export default async function CatedrasPage() {
  const catedras = await catedraService.getAll()
  return <CatedraList catedras={catedras} />
}
```

---

## 3. Server Actions

Used for **all mutations** (POST, PUT, DELETE). Declared with `"use server"`.

- Forward the session cookie from the incoming request via `headers()` from `next/headers`
- Call `revalidateTag` after successful mutations to bust the SSR cache
- Always return a typed result object — never throw to the client

```typescript
// app/api/actions/review.actions.ts
"use server"

import { revalidateTag } from "next/cache"
import { headers } from "next/headers"
import type { CreateReviewPayload } from "@/api/dtos/payloads/review"
import type { Review } from "@/api/dtos/review"

type ActionResult<T> = { success: true; data: T } | { success: false; error: string }

export async function createReviewAction(
  payload: CreateReviewPayload,
): Promise<ActionResult<Review>> {
  const API = process.env.API_URL!
  const cookie = (await headers()).get("cookie") ?? ""

  const res = await fetch(`${API}/v1/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      cookie, // forwards session to Express
    },
    body: JSON.stringify(payload),
  })

  const json = await res.json()

  if (!res.ok) {
    return { success: false, error: json.message ?? "Error al crear la experiencia" }
  }

  revalidateTag("reviews") // busts the SSR cache for the reviews feed
  revalidateTag(`catedra-${payload.catedraId}`)

  return { success: true, data: json.data }
}
```

Usage in a Client Component:

```typescript
"use client"

import { createReviewAction } from "@/api/actions/review.actions"

async function handleSubmit(payload: CreateReviewPayload) {
  const result = await createReviewAction(payload)
  if (!result.success) {
    setError(result.error)
    return
  }
  router.push("/")
}
```

---

## 4. Client Services

Used **only** when Server Actions are not enough:

- Real-time polling
- Optimistic updates with React Query
- Interactions that need immediate client-side response before server confirmation

```typescript
// app/api/services/review.service.client.ts
import type { CreateReviewPayload } from "@/api/dtos/payloads/review"
import type { Review } from "@/api/dtos/review"

const API = process.env.NEXT_PUBLIC_API_URL!

export const reviewClientService = {
  async create(payload: CreateReviewPayload): Promise<Review> {
    const res = await fetch(`${API}/v1/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.message ?? "Error al crear experiencia")
    return json.data
  },
}
```

---

## 5. React Query

Use React Query **only** for these cases:

| Case                                       | Solution                              |
| ------------------------------------------ | ------------------------------------- |
| Initial page data                          | Server Component + server service     |
| Form submission / mutation                 | Server Action                         |
| Real-time data / polling                   | React Query `refetchInterval`         |
| Complex optimistic updates                 | React Query mutation + client service |
| Data that changes without user interaction | React Query                           |

When React Query is needed, create hooks in `/hooks/`:

```typescript
// app/hooks/useReviews.ts
"use client"

import { useQuery } from "@tanstack/react-query"
import { reviewClientService } from "@/api/services/review.service.client"

export function useReviews(catedraSlug: string) {
  return useQuery({
    queryKey: ["reviews", catedraSlug],
    queryFn: () => reviewClientService.getByCatedra(catedraSlug),
    staleTime: 60 * 1000,
  })
}
```

---

## Decision Tree

```
Need data for initial render?
  └─ Yes → Server Component + server service

Need to mutate data (POST/PUT/DELETE)?
  └─ Yes → Server Action
       └─ Need optimistic UI? → Server Action + useOptimistic()
       └─ Very complex optimistic? → React Query mutation + client service

Need data to update without user interaction?
  └─ Yes → React Query with refetchInterval

Need data after user interaction (not a mutation)?
  └─ Yes → Server Action (can also read data) or client service
```

---

## Cache Invalidation Strategy

Tag server fetches and invalidate by tag after mutations:

```typescript
// Tagging on fetch (server service)
fetch(`${API}/v1/reviews`, {
  next: { tags: ["reviews"] },
})

// Invalidating after mutation (server action)
revalidateTag("reviews")
```

Granular tags avoid over-invalidation:

```typescript
next: {
  tags: ["reviews", `catedra-${slug}-reviews`]
}

// Then invalidate only what changed:
revalidateTag(`catedra-${slug}-reviews`)
```

---

## Environment Variables

| Variable              | Where used                                                    |
| --------------------- | ------------------------------------------------------------- |
| `API_URL`             | Server services, Server Actions — never exposed to the client |
| `NEXT_PUBLIC_API_URL` | Client services only — visible in the browser bundle          |

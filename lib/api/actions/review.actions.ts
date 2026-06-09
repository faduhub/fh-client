"use server"

import { revalidateTag } from "next/cache"
import { headers } from "next/headers"
import { BASE } from "@/lib/api/fetcher.server"
import type { CreateReviewPayload } from "@/lib/api/dtos/payloads/review"
import type { Review } from "@/lib/api/dtos/responses/review"

type ActionResult<T> = { success: true; data: T } | { success: false; error: string }

export async function createReviewAction(
  payload: CreateReviewPayload,
): Promise<ActionResult<Review>> {
  const cookie = (await headers()).get("cookie") ?? ""

  const res = await fetch(`${BASE}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      cookie,
    },
    body: JSON.stringify(payload),
  })

  const json = await res.json()

  if (!res.ok) {
    return { success: false, error: json.message ?? "Error al crear la reseña" }
  }

  revalidateTag("reviews", "everything")
  revalidateTag(`department-${payload.departmentId}`, "everything")

  return { success: true, data: json.data }
}

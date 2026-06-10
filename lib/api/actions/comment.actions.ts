"use server"

import { http } from "@/lib/api/http.server"
import { action } from "@/lib/api/action.server"
import { commentService } from "@/lib/api/services/comment.service.server"
import type { CreateCommentPayload } from "@/lib/api/dtos/payloads/comment"

// Nota: los reads de comentarios son per-user (`likedByMe`) y van con `no-store`,
// por eso las mutaciones no necesitan `revalidateTag`: el server component
// re-fetchea fresco en cada navegación y la UI usa updates optimistas.

/** POST /v1/comments 🔒 — responde `{ success: true }` (sin el comment). */
export async function createCommentAction(payload: CreateCommentPayload) {
  return action(() => http.post<void>("/comments", { body: payload, auth: true }))
}

/** PATCH /v1/comments/:id 🔒 — solo el autor. */
export async function updateCommentAction(id: string, body: string) {
  return action(() => http.patch<void>(`/comments/${id}`, { body: { body }, auth: true }))
}

/** DELETE /v1/comments/:id 🔒 — soft delete, solo el autor. */
export async function deleteCommentAction(id: string) {
  return action(() => http.del<void>(`/comments/${id}`, { auth: true }))
}

/** POST /v1/comments/:id/likes 🔒 — idempotente. */
export async function likeCommentAction(id: string) {
  return action(() => http.post<void>(`/comments/${id}/likes`, { auth: true }))
}

/** DELETE /v1/comments/:id/likes 🔒 — idempotente. */
export async function unlikeCommentAction(id: string) {
  return action(() => http.del<void>(`/comments/${id}/likes`, { auth: true }))
}

/** Carga las respuestas de un comment (lazy, desde el cliente). */
export async function getRepliesAction(parentId: string) {
  return action(async () => (await commentService.getReplies(parentId)).data)
}

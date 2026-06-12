"use server"

import { http } from "@/lib/api/http.server"
import { action } from "@/lib/api/action.server"
import type { Post, BoardType } from "@/lib/api/dtos/responses/post"

export async function createPostAction(data: {
  boardType: BoardType
  boardId?: string
  title?: string
  body: string
}) {
  return action(() => http.post<Post>("/posts", { body: data, auth: true }))
}

export async function editPostAction(id: string, data: { title?: string; body?: string }) {
  return action(() => http.patch<Post>(`/posts/${id}`, { body: data, auth: true }))
}

export async function deletePostAction(id: string) {
  return action(() => http.del<void>(`/posts/${id}`, { auth: true }))
}

export async function likePostAction(id: string) {
  return action(() => http.post<void>(`/posts/${id}/likes`, { auth: true }))
}

export async function unlikePostAction(id: string) {
  return action(() => http.del<void>(`/posts/${id}/likes`, { auth: true }))
}

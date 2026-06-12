export type CommentSourceType = "REVIEW" | "POST"

export type CreateCommentPayload = {
  sourceType: CommentSourceType
  sourceId: string
  body: string
  /** Presente solo si es una respuesta a un comment top-level (un nivel). */
  parentId?: string
}

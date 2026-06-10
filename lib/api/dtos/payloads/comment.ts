/** Hoy el único sourceType válido es "REVIEW". */
export type CommentSourceType = "REVIEW"

export type CreateCommentPayload = {
  sourceType: CommentSourceType
  sourceId: string
  body: string
  /** Presente solo si es una respuesta a un comment top-level (un nivel). */
  parentId?: string
}

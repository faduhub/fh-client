export type Comment = {
  id: string
  author: string
  authorUsername: string | null
  authorSlug: string
  initials: string
  body: string
  date: string
  edited: boolean
  deleted: boolean
  likes: number
  /** Si el usuario logueado ya likeó (false sin sesión). */
  likedByMe: boolean
  /** Cantidad de respuestas; se cargan on-demand con `?parentId=`. */
  repliesCount: number
  parentId: string | null
}

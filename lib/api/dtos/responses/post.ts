export type BoardType = "GENERAL" | "CARRERA" | "MATERIA" | "CATEDRA"

export type Board = { name: string; slug: string } | null

export type Post = {
  id: string
  author: string
  authorUsername: string | null
  authorSlug: string
  initials: string
  boardType: BoardType
  board: Board
  title: string | null
  body: string
  date: string
  edited: boolean
  likes: number
  likedByMe: boolean
  commentsCount: number
}

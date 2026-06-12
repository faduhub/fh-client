export type Review = {
  id: string
  author: string
  authorSlug: string
  initials: string
  degree: string
  degreeSlug: string | null
  subject: string
  department: string
  departmentSlug: string
  head: string
  term: string
  year: number
  period: "FIRST" | "SECOND" | "SUMMER"
  rating: number | null
  workload: number | null
  difficulty: number | null
  recommends: boolean
  body: string
  likes: number
  date: string
  tags: string[]
  time: number
}

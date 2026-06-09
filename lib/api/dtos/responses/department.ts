import type { Review } from "./review"

export type DepartmentStats = {
  id: string
  slug: string
  name: string
  head: string
  subjects: string[]
  degrees: string[]
  reviews: Review[]
  rating: number
  workload: number
  difficulty: number
  recommendPct: number
  totalLikes: number
}

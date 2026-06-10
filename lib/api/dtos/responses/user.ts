import type { Review } from "./review"

export type UserProfile = {
  slug: string
  name: string
  initials: string
  degrees: Array<{ name: string; currentYear: number | null }>
  bio: string
  reviews: Review[]
  avgRating: number
  totalLikes: number
  recommendPct: number
  displayName: string
}
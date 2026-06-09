export type CreateReviewPayload = {
  departmentId: string
  subjectId?: string
  degreeId?: string
  rating: number
  workload: number
  difficulty: number
  recommends: boolean
  body: string
  year: number
  period: "FIRST" | "SECOND" | "SUMMER"
  tagIds?: number[]
}

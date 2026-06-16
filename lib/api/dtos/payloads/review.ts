export type CreateReviewPayload = {
  departmentId: string
  subjectId?: string
  degreeId?: string
  cursadaId?: string
  recommends: boolean
  body: string
  year: number
  period: "FIRST" | "SECOND" | "SUMMER"
  tagIds?: number[]
}

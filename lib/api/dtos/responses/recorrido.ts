/** Recorrido académico del usuario logueado (`GET /users/me/recorrido`). */
export type Recorrido = {
  degree: { id: string; name: string; slug: string }
  totals: { loaded: number; plan: number; percent: number }
  currentYear: {
    year: number | null
    label: string | null
  }
  years: Array<{
    year: number
    loaded: number
    total: number
    percent: number
    completed: boolean
  }>
  suggestedNext: Array<{
    id: string
    name: string
    slug: string
    year: number
    experiencesCount: number
  }>
}

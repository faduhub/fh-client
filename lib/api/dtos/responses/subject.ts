export type SubjectItem = {
  id: number
  name: string
  slug: string
  anio: number | null
  degrees: Array<{ name: string; slug: string }>
  departments: Array<{ name: string; slug: string }>
}

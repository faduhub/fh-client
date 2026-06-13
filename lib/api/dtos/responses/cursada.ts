export type CursadaStatus = "CURSANDO" | "REGULAR" | "APROBADA" | "ABANDONADA"
export type AcademicPeriod = "FIRST" | "SECOND" | "SUMMER"

export type Cursada = {
  id: string
  status: CursadaStatus
  year: number | null
  period: AcademicPeriod | null
  subject: { name: string; slug: string }
  department: { name: string; slug: string } | null
  degree: { name: string; slug: string } | null
}

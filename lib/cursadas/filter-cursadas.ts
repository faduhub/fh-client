import type { Cursada } from "@/lib/api/dtos/responses/cursada"
import type { Me } from "@/lib/api/dtos/responses/me"

type EnrolledDegree = Me["degrees"][number]

export function filterCursadasByDegree(params: {
  cursadas: Cursada[]
  activeDegree: EnrolledDegree | null
  enrolledDegreesCount: number
}) {
  const { cursadas, activeDegree, enrolledDegreesCount } = params

  if (!activeDegree || enrolledDegreesCount <= 1) {
    return cursadas
  }

  return cursadas.filter((cursada) => !cursada.degree || cursada.degree.slug === activeDegree.slug)
}

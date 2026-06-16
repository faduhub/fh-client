import { departmentService } from "@/lib/api/services/department.service.server"
import { subjectService } from "@/lib/api/services/subject.service.server"
import { tagService } from "@/lib/api/services/tag.service.server"
import { degreeService } from "@/lib/api/services/degree.service.server"
import { accountService } from "@/lib/api/services/account.service.server"
import { ReviewForm } from "./review-form"

export default async function CrearExperienciaPage({
  searchParams,
}: {
  searchParams: Promise<{
    cursadaId?: string
    materia?: string
    catedra?: string
    carrera?: string
  }>
}) {
  const [{ cursadaId, materia, catedra, carrera }, departments, subjects, tags, degrees, me] =
    await Promise.all([
      searchParams,
      departmentService.getAll(),
      subjectService.getAll(),
      tagService.getAll(),
      degreeService.getAll(),
      accountService.getMe(),
    ])

  const fromCursada = Boolean(cursadaId)

  const initialSubjectId = materia
    ? (subjects.find((s) => s.slug === materia)?.id.toString() ?? null)
    : null
  const initialCatedraSlug = catedra && departments.some((d) => d.slug === catedra) ? catedra : null

  const fallbackDegree = fromCursada ? me?.degrees[0] : undefined
  const initialDegree = degrees.find((d) => d.slug === carrera) ?? fallbackDegree
  const initialDegreeId = initialDegree?.id.toString() ?? null

  return (
    <main className="bg-background relative min-h-screen">
      <div className="relative mx-auto w-full max-w-3xl px-5 py-8 sm:px-8 sm:py-12">
        <ReviewForm
          departments={departments}
          subjects={subjects}
          tags={tags}
          degrees={degrees}
          cursadaId={cursadaId ?? null}
          locked={fromCursada}
          initialSubjectId={initialSubjectId}
          initialCatedraSlug={initialCatedraSlug}
          initialDegreeId={initialDegreeId}
        />
      </div>
    </main>
  )
}

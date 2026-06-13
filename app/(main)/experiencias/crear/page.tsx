import { departmentService } from "@/lib/api/services/department.service.server"
import { subjectService } from "@/lib/api/services/subject.service.server"
import { tagService } from "@/lib/api/services/tag.service.server"
import { degreeService } from "@/lib/api/services/degree.service.server"
import { ReviewForm } from "./review-form"

export default async function CrearExperienciaPage() {
  const [departments, subjects, tags, degrees] = await Promise.all([
    departmentService.getAll(),
    subjectService.getAll(),
    tagService.getAll(),
    degreeService.getAll(),
  ])

  return (
    <main className="bg-background relative min-h-screen">
      <div className="relative mx-auto w-full max-w-3xl px-5 py-8 sm:px-8 sm:py-12">
        <ReviewForm departments={departments} subjects={subjects} tags={tags} degrees={degrees} />
      </div>
    </main>
  )
}

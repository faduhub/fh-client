import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { departmentService } from "@/lib/api/services/department.service.server"
import { subjectService } from "@/lib/api/services/subject.service.server"
import { tagService } from "@/lib/api/services/tag.service.server"
import { degreeService } from "@/lib/api/services/degree.service.server"
import { ReviewForm } from "./review-form"

export default async function NuevaResenaPage() {
  const [departments, subjects, tags, degrees] = await Promise.all([
    departmentService.getAll(),
    subjectService.getAll(),
    tagService.getAll(),
    degreeService.getAll(),
  ])

  return (
    <main className="bg-background min-h-screen">
      <section className="border-border border-b">
        <div className="mx-auto max-w-3xl px-6 py-12">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-xs font-medium tracking-wider uppercase transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            Volver al inicio
          </Link>

          <h1 className="text-foreground mt-6 font-serif text-4xl leading-tight sm:text-5xl">
            Conta tu experiencia
          </h1>
          <p className="text-muted-foreground mt-2">
            Compartí tu experiencia con la comunidad de FaduHub.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-12">
        <ReviewForm departments={departments} subjects={subjects} tags={tags} degrees={degrees} />
      </section>
    </main>
  )
}

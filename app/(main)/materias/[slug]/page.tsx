import { notFound } from "next/navigation"
import { subjectService } from "@/lib/api/services/subject.service.server"
import { departmentService } from "@/lib/api/services/department.service.server"
import { DepartmentCard } from "@/app/components/ui/department-card"
import AppHeader from "@/app/components/ui/app-header"
import type { Metadata } from "next"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const subjects = await subjectService.getAll()
  const subject = subjects.find((s) => s.slug === slug)
  return {
    title: subject ? `${subject.name} · faduHub` : "Materia · faduHub",
  }
}

export default async function MateriaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const [subjects, departments] = await Promise.all([
    subjectService.getAll(),
    departmentService.getByMateriaSlug(slug),
  ])

  const subject = subjects.find((s) => s.slug === slug)
  if (!subject) notFound()

  return (
    <main className="bg-background min-h-screen">
      <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
        <AppHeader title={subject.name} />

        <div className="mt-8">
          {departments.length === 0 ? (
            <p className="border-border bg-secondary/30 text-muted-foreground rounded-xl border border-dashed px-4 py-12 text-center text-sm">
              No hay cátedras registradas para esta materia todavía.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {departments.map((dept) => (
                <DepartmentCard
                  key={dept.id}
                  name={dept.name}
                  slug={dept.slug}
                  recommendPct={Math.round(dept.recommendPct)}
                  reviewCount={dept.reviews.length}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

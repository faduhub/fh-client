import { notFound } from "next/navigation"
import { degreeService } from "@/lib/api/services/degree.service.server"
import { subjectService } from "@/lib/api/services/subject.service.server"
import { SubjectCard } from "@/app/components/ui/subject-card"
import AppHeader from "@/app/components/ui/app-header"
import type { Metadata } from "next"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const degrees = await degreeService.getAll()
  const degree = degrees.find((d) => d.slug === slug)
  return {
    title: degree ? `${degree.name} · faduHub` : "Carrera · faduHub",
  }
}

export default async function CarreraPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const [degrees, subjects] = await Promise.all([degreeService.getAll(), subjectService.getAll()])

  const degree = degrees.find((d) => d.slug === slug)
  if (!degree) notFound()

  const degreeSubjects = subjects
    .filter((s) => s.degrees.some((d) => d.slug === slug))
    .sort((a, b) => {
      if (a.anio === null) return 1
      if (b.anio === null) return -1
      return a.anio - b.anio
    })

  const grouped = Object.groupBy(degreeSubjects, (s) =>
    s.anio !== null ? `${s.anio}° año` : "Sin año asignado",
  )

  return (
    <main className="bg-background min-h-screen">
      <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
        <AppHeader title={degree.name} />

        <div className="mt-8 flex flex-col gap-10">
          {Object.entries(grouped).map(([year, yearSubjects]) => (
            <section key={year}>
              <h2 className="text-muted-foreground mb-4 font-mono text-[0.7rem] tracking-[0.2em] uppercase">
                {year}
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {yearSubjects!.map((subject) => (
                  <SubjectCard
                    key={subject.id}
                    name={subject.name}
                    slug={subject.slug}
                    departmentCount={subject.departments.length}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  )
}

import { GraduationCap, BookOpen, Layers, Shuffle, Sparkles, TrendingUp } from "lucide-react"
import { subjectService } from "@/lib/api/services/subject.service.server"
import { departmentService } from "@/lib/api/services/department.service.server"
import { AppSearchInput } from "@/app/components/ui/app-search-input"
import { CategoryCard } from "@/app/components/ui/category-card"
import { SubjectCard } from "@/app/components/ui/subject-card"
import { DepartmentCard } from "@/app/components/ui/department-card"
import { AppSection } from "@/app/components/ui/app-section"
import AppHeader from "@/app/components/ui/app-header"

const CATEGORIES = [
  {
    icon: <GraduationCap className="size-5" />,
    title: "Carreras",
    description: "Recorré planes de estudio y materias por año.",
    href: "carreras",
  },
  {
    icon: <BookOpen className="size-5" />,
    title: "Materias",
    description: "Encontrá materias, cátedras disponibles y experiencias.",
    href: "materias",
  },
  {
    icon: <Layers className="size-5" />,
    title: "Cátedras",
    description: "Compará cátedras, carga, dificultad y recomendaciones.",
    href: "catedras",
  },
  {
    icon: <Shuffle className="size-5" />,
    title: "Cursadas",
    description: "Descubrí cursadas, experiencias y alumnos que las cursaron.",
    href: "cursadas",
  },
]

export default async function ExplorarPage() {
  const [subjects, departments] = await Promise.all([
    subjectService.getAll(),
    departmentService.getAll(),
  ])

  const featuredSubjects = subjects.slice(0, 4)
  const popularDepartments = [...departments]
    .sort((a, b) => b.reviews.length - a.reviews.length)
    .slice(0, 4)

  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto max-w-6xl px-6 py-12 sm:px-8">
        <AppHeader title="Explorar" />

        {/* Search */}
        <div className="mt-8 mb-10">
          <AppSearchInput />
        </div>

        {/* Categories */}
        <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <CategoryCard key={cat.title} {...cat} />
          ))}
        </div>

        <div className="flex flex-col gap-12">
          {/* De tu carrera */}
          <AppSection
            icon={<Sparkles className="text-primary size-5" />}
            title="De tu carrera"
            subtitle="Materias y cátedras de tu año en Diseño Gráfico."
            href="/explorar/materias"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {featuredSubjects.map((subject) => (
                <SubjectCard
                  key={subject.id}
                  name={subject.name}
                  slug={subject.slug}
                  year={subject.anio}
                  degreeName={subject.degrees[0]?.name}
                  departmentCount={subject.departments.length}
                />
              ))}
            </div>
          </AppSection>

          {/* Popular esta semana */}
          <AppSection
            icon={<TrendingUp className="text-accent size-5" />}
            title="Popular esta semana"
            subtitle="Lo que más movimiento tiene entre estudiantes."
            href="/explorar/catedras"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {popularDepartments.map((dept) => (
                <DepartmentCard
                  key={dept.id}
                  name={dept.name}
                  slug={dept.slug}
                  subjectName={dept.subjects[0]}
                  recommendPct={Math.round(dept.recommendPct)}
                  reviewCount={dept.reviews.length}
                />
              ))}
            </div>
          </AppSection>
        </div>
      </div>
    </div>
  )
}

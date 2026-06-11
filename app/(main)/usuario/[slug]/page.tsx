import { ProfileHeader } from "@/app/components/profile-headbar"
import { ReviewCard } from "@/app/components/review-card"
import type { Review } from "@/lib/api/dtos/responses/review"
import { ProfileSidebar } from "./_components/profile-sidebar"
import { ReviewFilters } from "./_components/review-filters"
import { Achievements } from "./_components/achievements"
import { CurrentCourses } from "./_components/current-courses"

const reviews: Review[] = [
  {
    id: "1",
    author: "Martina Ferreyra",
    authorSlug: "martina-ferreyra",
    initials: "MF",
    degree: "Diseño Gráfico",
    degreeSlug: "diseno-grafico",
    subject: "Diseño Gráfico III",
    department: "Cátedra Gabriele",
    departmentSlug: "gabriele",
    head: "Gabriele",
    term: "2° Cuat. 2025",
    year: 2025,
    period: "SECOND",
    rating: 5,
    workload: 5,
    difficulty: 4,
    recommends: true,
    body: "La mejor cursada que tuve. Las correcciones son durísimas pero te hacen crecer un montón. Muy recomendable si bancás el ritmo.",
    likes: 142,
    date: "hoy",
    tags: ["Mucho trabajo", "Buenas correcciones", "Exigente"],
  },
  {
    id: "2",
    author: "Martina Ferreyra",
    authorSlug: "martina-ferreyra",
    initials: "MF",
    degree: "Diseño Gráfico",
    degreeSlug: "diseno-grafico",
    subject: "Tipografía II",
    department: "Cátedra Cosgaya",
    departmentSlug: "cosgaya",
    head: "Cosgaya",
    term: "1° Cuat. 2025",
    year: 2025,
    period: "FIRST",
    rating: 4,
    workload: 4,
    difficulty: 3,
    recommends: true,
    body: "Muy completa en lo técnico. Te vas con una base de tipografía sólida, aunque el ritmo de entregas es intenso sobre el final.",
    likes: 87,
    date: "hace 2 meses",
    tags: ["Bien organizada", "Mucha teoría"],
  },
  {
    id: "3",
    author: "Martina Ferreyra",
    authorSlug: "martina-ferreyra",
    initials: "MF",
    degree: "Diseño Gráfico",
    degreeSlug: "diseno-grafico",
    subject: "Morfología I",
    department: "Cátedra Wolkowicz",
    departmentSlug: "wolkowicz",
    head: "Wolkowicz",
    term: "1° Cuat. 2024",
    year: 2024,
    period: "FIRST",
    rating: 3,
    workload: 3,
    difficulty: 3,
    recommends: false,
    body: "Buenos contenidos pero la cursada se siente desordenada. Si te enganchás con los trabajos prácticos la pasás bien.",
    likes: 31,
    date: "hace 1 año",
    tags: ["Trabajos grupales", "Variable"],
  },
]

export default function Page() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* Gradientes de fondo sutiles */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
        <div className="bg-primary/15 absolute -top-40 -left-40 size-[36rem] rounded-full blur-[120px]" />
        <div className="bg-accent/15 absolute top-1/3 -right-40 size-[32rem] rounded-full blur-[120px]" />
      </div>

      <main className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:py-12">
        <ProfileHeader />

        <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
          {/* Sidebar sticky */}
          <aside className="flex flex-col gap-6 lg:sticky lg:top-8 lg:w-[20rem] lg:shrink-0">
            <ProfileSidebar />
            <CurrentCourses />
            <Achievements />
          </aside>

          {/* Reseñas */}
          <section className="min-w-0 flex-1">
            <div className="flex items-end justify-between gap-4">
              <div>
                <span className="text-primary font-mono text-[0.7rem] tracking-[0.2em] uppercase">
                  USR_01 / Reseñas
                </span>
                <h2 className="text-foreground mt-1 font-serif text-3xl font-medium tracking-tight sm:text-4xl">
                  Reseñas de Martina
                </h2>
              </div>
              <span
                aria-hidden="true"
                className="text-primary/30 hidden font-serif text-5xl leading-none font-medium sm:block"
              >
                01
              </span>
            </div>
            <div className="from-primary/60 via-border mt-5 h-px w-full bg-gradient-to-r to-transparent" />

            <div className="mt-6">
              <ReviewFilters />
            </div>

            <div className="mt-7 flex flex-col gap-5">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

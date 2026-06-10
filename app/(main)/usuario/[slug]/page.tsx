import { ProfileSidebar } from "../../../components/ui/profile-sidebar"
import { ProfileHeader } from "../../../components/ui/profile-headbar"
import { ReviewCard, type Review } from '../../../components/ui/review-card'
import { ReviewFilters } from '../../../components/ui/review-filters'
import { Achievements } from '../../../components/ui/achievements'
import { CurrentCourses } from '../../../components/ui/current-courses'

const reviews: Review[] = [
  {
    id: '1',
    subject: 'Diseño Gráfico III',
    catedra: 'Cátedra Gabriele',
    professor: 'Gabriele',
    career: 'Diseño Gráfico',
    rating: 5,
    body: 'La mejor cursada que tuve. Las correcciones son durísimas pero te hacen crecer un montón. Muy recomendable si bancás el ritmo.',
    tags: ['Mucho trabajo', 'Buenas correcciones', 'Exigente'],
    recommended: true,
    author: 'martina-ferreyra',
    period: '2° Cuat. 2025',
    time: 'hoy',
    likes: 142,
  },
  {
    id: '2',
    subject: 'Tipografía II',
    catedra: 'Cátedra Cosgaya',
    professor: 'Cosgaya',
    career: 'Diseño Gráfico',
    rating: 4,
    body: 'Muy completa en lo técnico. Te vas con una base de tipografía sólida, aunque el ritmo de entregas es intenso sobre el final.',
    tags: ['Bien organizada', 'Mucha teoría'],
    recommended: true,
    author: 'martina-ferreyra',
    period: '1° Cuat. 2025',
    time: 'hace 2 meses',
    likes: 87,
  },
  {
    id: '3',
    subject: 'Morfología I',
    catedra: 'Cátedra Wolkowicz',
    professor: 'Wolkowicz',
    career: 'Diseño Gráfico',
    rating: 3,
    body: 'Buenos contenidos pero la cursada se siente desordenada. Si te enganchás con los trabajos prácticos la pasás bien.',
    tags: ['Trabajos grupales', 'Variable'],
    recommended: false,
    author: 'martina-ferreyra',
    period: '1° Cuat. 2024',
    time: 'hace 1 año',
    likes: 31,
  },
]

export default function Page() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* Gradientes de fondo sutiles */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
      >
        <div className="absolute -left-40 -top-40 size-[36rem] rounded-full bg-primary/15 blur-[120px]" />
        <div className="absolute -right-40 top-1/3 size-[32rem] rounded-full bg-accent/15 blur-[120px]" />
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
                <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-primary">
                  USR_01 / Reseñas
                </span>
                <h2 className="mt-1 font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
                  Reseñas de Martina
                </h2>
              </div>
              <span
                aria-hidden="true"
                className="hidden font-serif text-5xl font-medium leading-none text-primary/30 sm:block"
              >
                01
              </span>
            </div>
            <div className="mt-5 h-px w-full bg-gradient-to-r from-primary/60 via-border to-transparent" />

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

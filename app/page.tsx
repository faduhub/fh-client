import { getReviews, getCarreras, getMaterias } from "@/lib/api"
import { ReviewsFeed } from "@/app/components/reviews-feed"
import { SiteHeader } from "@/app/components/site-header"

export default async function Page() {
  const [reviews, degrees, subjects] = await Promise.all([
    getReviews(),
    getCarreras(),
    getMaterias(),
  ])

  const promedio = reviews.reduce((acc, r) => acc + (r.rating ?? 0), 0) / (reviews.length || 1)

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />

      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            Reseñas de cursadas · escritas por estudiantes
          </p>
          <h1 className="mt-4 max-w-3xl text-balance text-5xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-7xl">
            Elegí tu cátedra sabiendo en qué te metés.
          </h1>
          <p className="mt-6 max-w-xl text-pretty leading-relaxed text-muted-foreground">
            Opiniones reales sobre las cursadas de la Facultad de Arquitectura, Diseño y Urbanismo.
            Filtrá por carrera, materia y puntaje antes de inscribirte al cuatrimestre.
          </p>
          <dl className="mt-10 flex flex-wrap gap-x-12 gap-y-6">
            <div>
              <dt className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Reseñas</dt>
              <dd className="text-4xl font-bold tracking-tight text-foreground">{reviews.length}</dd>
            </div>
            <div>
              <dt className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Cátedras</dt>
              <dd className="text-4xl font-bold tracking-tight text-foreground">{subjects.length}</dd>
            </div>
            <div>
              <dt className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Promedio</dt>
              <dd className="text-4xl font-bold tracking-tight text-foreground">{promedio.toFixed(1)}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section id="reseñas" className="mx-auto max-w-7xl px-6 py-12">
        <ReviewsFeed reviews={reviews} degrees={degrees} subjects={subjects} />
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-8 text-xs text-muted-foreground sm:flex-row">
          <p>Reseñas de Cátedras · FADU — proyecto de ejemplo.</p>
          <p className="font-mono uppercase tracking-wider">Hecho por estudiantes, para estudiantes</p>
        </div>
      </footer>
    </main>
  )
}

import { getReviews, getCarreras, getMaterias } from "@/lib/api"
import { ReviewsFeed } from "@/app/components/reviews-feed"

export default async function Page() {
  const [reviews, carreras, materias] = await Promise.all([
    getReviews(),
    getCarreras(),
    getMaterias(),
  ])

  const promedio = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold leading-none tracking-tight text-foreground">cátedras</span>
            <span className="font-mono text-xs uppercase tracking-widest text-accent">FADU</span>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground sm:flex">
            <a href="#reseñas" className="transition-colors hover:text-foreground">Reseñas</a>
            <a href="/catedras" className="transition-colors hover:text-foreground">Cátedras</a>
            <a href="#" className="rounded-full bg-foreground px-4 py-1.5 text-background transition-opacity hover:opacity-90">
              Dejar reseña
            </a>
          </nav>
        </div>
      </header>

      <section className="border-b border-border">
        <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
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
              <dd className="text-4xl font-bold tracking-tight text-foreground">{materias.length}</dd>
            </div>
            <div>
              <dt className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Promedio</dt>
              <dd className="text-4xl font-bold tracking-tight text-foreground">{promedio.toFixed(1)}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section id="reseñas" className="mx-auto max-w-5xl px-6 py-12">
        <ReviewsFeed reviews={reviews} carreras={carreras} materias={materias} />
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-6 py-8 text-xs text-muted-foreground sm:flex-row">
          <p>Reseñas de Cátedras · FADU — proyecto de ejemplo.</p>
          <p className="font-mono uppercase tracking-wider">Hecho por estudiantes, para estudiantes</p>
        </div>
      </footer>
    </main>
  )
}

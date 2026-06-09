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

            <section className="">
        <div className="mx-auto max-w-7xl px-6 pt-12">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Reseñas de cursadas · escritas por estudiantes</p>
          <h1 className="mt-2.5 text-balance text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-3xl">
            Home
          </h1>
          
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

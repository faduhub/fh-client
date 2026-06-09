import { reviewService } from "@/lib/api/services/review.service.server"
import { degreeService } from "@/lib/api/services/degree.service.server"
import { subjectService } from "@/lib/api/services/subject.service.server"
import { ReviewsFeed } from "@/app/components/reviews-feed"

export default async function Page() {
  const [reviews, degrees, subjects] = await Promise.all([
    reviewService.getAll(),
    degreeService.getAll(),
    subjectService.getAll(),
  ])

  return (
    <main className="min-h-screen bg-background">

            <section className="">
        <div className="mx-auto max-w-5xl px-6 pt-12">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Reseñas de cursadas · escritas por estudiantes</p>
          <h1 className="mt-2.5 text-balance text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-3xl">
            Home 
          </h1>
          
        </div>
      </section>


      <section id="reseñas" className="mx-auto max-w-5xl px-6 py-12">
        <ReviewsFeed reviews={reviews} degrees={degrees} subjects={subjects} />
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

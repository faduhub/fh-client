import { reviewService } from "@/lib/api/services/review.service.server"
import { degreeService } from "@/lib/api/services/degree.service.server"
import { subjectService } from "@/lib/api/services/subject.service.server"
import { ReviewsFeed } from "@/app/components/reviews-feed"

export default async function ExperienciasPage() {
  const [reviews, degrees, subjects] = await Promise.all([
    reviewService.getAll(),
    degreeService.getAll(),
    subjectService.getAll(),
  ])

  return (
    <main className="bg-background min-h-screen">
      <section className="">
        <div className="mx-auto max-w-5xl px-6 pt-12">
          <p className="text-accent font-mono text-xs tracking-[0.2em] uppercase">
            Experiencias de cursadas · escritas por estudiantes
          </p>
          <h1 className="text-foreground mt-2.5 text-4xl leading-[1.05] font-bold tracking-tight text-balance sm:text-3xl">
            Experiencias
          </h1>
        </div>
      </section>

      <section id="experiencias" className="mx-auto max-w-5xl px-6 py-12">
        <ReviewsFeed reviews={reviews} degrees={degrees} subjects={subjects} />
      </section>

      <footer className="border-border border-t">
        <div className="text-muted-foreground mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-6 py-8 text-xs sm:flex-row">
          <p>Experiencias de Cátedras · FADU — proyecto de ejemplo.</p>
          <p className="font-mono tracking-wider uppercase">
            Hecho por estudiantes, para estudiantes
          </p>
        </div>
      </footer>
    </main>
  )
}

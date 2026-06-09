import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Check, ThumbsUp } from "lucide-react"
import { getCatedra } from "@/lib/api"
import { SiteHeader } from "@/app/components/site-header"
import { StarRating } from "@/app/components/star-rating"
import { ReviewCard } from "@/app/components/review-card"
import { Badge } from "@/app/components/ui/badge"

function BarStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
        <span className="font-mono text-sm text-foreground">{value.toFixed(1)}</span>
      </div>
      <div className="flex items-center gap-1" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={i <= Math.round(value) ? "h-1.5 flex-1 rounded-full bg-foreground" : "h-1.5 flex-1 rounded-full bg-border"}
          />
        ))}
      </div>
    </div>
  )
}

export default async function CatedraPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const catedra = await getCatedra(slug)
  if (!catedra) notFound()

  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: catedra.reviews.filter((r) => Math.round(r.rating) === star).length,
  }))
  const maxCount = Math.max(1, ...dist.map((d) => d.count))
  const tags = Array.from(new Set(catedra.reviews.flatMap((r) => r.tags)))

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />

      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
          <Link
            href="/#reseñas"
            className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Volver a reseñas
          </Link>

          <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
                {catedra.materias.join(" / ")} · {catedra.carreras.join(" / ")}
              </p>
              <h1 className="mt-3 text-balance font-serif text-5xl leading-[1.05] text-foreground sm:text-6xl">
                {catedra.catedra}
              </h1>
              <p className="mt-3 text-muted-foreground">A cargo de {catedra.titular}</p>
              {tags.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {tags.map((t) => (
                    <Badge key={t} variant="secondary" className="rounded-full font-normal">{t}</Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-6 border border-border bg-card p-6">
              <div className="text-center">
                <p className="font-serif text-6xl leading-none text-foreground">{catedra.rating.toFixed(1)}</p>
                <div className="mt-2 flex justify-center">
                  <StarRating value={catedra.rating} size={16} />
                </div>
                <p className="mt-2 font-mono text-xs text-muted-foreground">
                  {catedra.reviews.length} {catedra.reviews.length === 1 ? "reseña" : "reseñas"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
          <aside className="lg:sticky lg:top-8 lg:self-start">
            <div className="flex flex-col gap-6 border border-border bg-card p-6">
              <h2 className="font-serif text-2xl text-foreground">Resumen</h2>
              <BarStat label="Carga horaria" value={catedra.cargaHoraria} />
              <BarStat label="Dificultad" value={catedra.dificultad} />
              <div className="flex items-center justify-between border-t border-border pt-4">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">La recomiendan</span>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <Check className="size-4 text-accent" />
                  {catedra.recomiendaPct}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Likes totales</span>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <ThumbsUp className="size-4" />
                  {catedra.totalLikes}
                </span>
              </div>
              <div className="flex flex-col gap-2 border-t border-border pt-4">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Distribución</span>
                {dist.map((d) => (
                  <div key={d.star} className="flex items-center gap-2">
                    <span className="w-3 font-mono text-xs text-muted-foreground">{d.star}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-border">
                      <div className="h-full rounded-full bg-accent" style={{ width: `${(d.count / maxCount) * 100}%` }} />
                    </div>
                    <span className="w-4 text-right font-mono text-xs text-muted-foreground">{d.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <div>
            <h2 className="mb-6 border-b border-border pb-4 font-serif text-2xl text-foreground">
              Reseñas de estudiantes
            </h2>
            <div className="flex flex-col gap-4">
              {catedra.reviews.map((r) => <ReviewCard key={r.id} review={r} />)}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

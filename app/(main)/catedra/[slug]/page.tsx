import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Check, FileIcon, Filter, ThumbsUp } from "lucide-react"
import { departmentService } from "@/lib/api/services/department.service.server"
import { StarRating } from "@/app/components/star-rating"
import { ReviewCard } from "@/app/components/review-card"
import { Badge } from "@/app/components/ui/badge"

export default async function CatedraPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const catedra = await departmentService.getBySlug(slug)
  if (!catedra) notFound()

  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: catedra.reviews.filter((r) => r.rating != null && Math.round(r.rating) === star).length,
  }))
  const maxCount = Math.max(1, ...dist.map((d) => d.count))
  const tags = Array.from(new Set(catedra.reviews.flatMap((r) => r.tags)))

  return (
    <main className="min-h-screen bg-background">

            <section className="">
        <div className="mx-auto max-w-5xl px-6 pt-12">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">{catedra.subjects.join(" / ")} · {catedra.degrees.join(" / ")}</p>
          <h1 className="mt-2.5 text-balance text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-3xl">
            {catedra.name}
          </h1>
          
        </div>
      </section>
      

      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
          <aside className="hidden lg:flex flex-col gap-5 sticky top-6 bg-card border-border border p-5 rounded-md">
            
          <div className="flex items-center gap-x-1.5 text-sm font-medium text-foreground">
            <FileIcon className="size-3.5" />
            Detalle
          
        </div>

              <div className="flex items-center justify-between border-t border-border pt-4">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">La recomiendan</span>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <Check className="size-4 text-accent" />
                  {catedra.recommendPct}%
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
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Tags</span>
                {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((t) => (
                    <Badge key={t} variant="secondary" className="rounded-full font-normal">{t}</Badge>
                  ))}
                </div>
              )}
              </div>
              <div className="flex flex-col gap-2 border-t border-border pt-4">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Links</span>
                
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="rounded-full font-normal">Instagram</Badge>
                  <Badge variant="secondary" className="rounded-full font-normal">Web</Badge>
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

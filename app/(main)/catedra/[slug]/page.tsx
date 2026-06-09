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
    <main className="bg-background min-h-screen">
      <section className="">
        <div className="mx-auto max-w-5xl px-6 pt-12">
          <p className="text-accent font-mono text-xs tracking-[0.2em] uppercase">
            {catedra.subjects.join(" / ")} · {catedra.degrees.join(" / ")}
          </p>
          <h1 className="text-foreground mt-2.5 text-4xl leading-[1.05] font-bold tracking-tight text-balance sm:text-3xl">
            {catedra.name}
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
          <aside className="bg-card border-border sticky top-6 hidden flex-col gap-5 rounded-md border p-5 lg:flex">
            <div className="text-foreground flex items-center gap-x-1.5 text-sm font-medium">
              <FileIcon className="size-3.5" />
              Detalle
            </div>

            <div className="border-border flex items-center justify-between border-t pt-4">
              <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                La recomiendan
              </span>
              <span className="text-foreground inline-flex items-center gap-1.5 text-sm font-medium">
                <Check className="text-accent size-4" />
                {catedra.recommendPct}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Likes totales
              </span>
              <span className="text-foreground inline-flex items-center gap-1.5 text-sm font-medium">
                <ThumbsUp className="size-4" />
                {catedra.totalLikes}
              </span>
            </div>
            <div className="border-border flex flex-col gap-2 border-t pt-4">
              <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Tags
              </span>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((t) => (
                    <Badge key={t} variant="secondary" className="rounded-full font-normal">
                      {t}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <div className="border-border flex flex-col gap-2 border-t pt-4">
              <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Links
              </span>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="rounded-full font-normal">
                  Instagram
                </Badge>
                <Badge variant="secondary" className="rounded-full font-normal">
                  Web
                </Badge>
              </div>
            </div>
          </aside>

          <div>
            <h2 className="border-border text-foreground mb-6 border-b pb-4 font-serif text-2xl">
              Reseñas de estudiantes
            </h2>
            <div className="flex flex-col gap-4">
              {catedra.reviews.map((r) => (
                <ReviewCard key={r.id} review={r} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

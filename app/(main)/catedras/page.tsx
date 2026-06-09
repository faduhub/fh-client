import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { departmentService } from "@/lib/api/services/department.service.server"
import { StarRating } from "@/app//components/star-rating"

export default async function CatedrasPage() {
  const catedras = await departmentService.getAll()

  return (
    <main className="min-h-screen bg-background">

                  <section className="">
        <div className="mx-auto max-w-5xl px-6 pt-12">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Reseñas de cursadas · escritas por estudiantes</p>
          <h1 className="mt-2.5 text-balance text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-3xl">
            Cátedras 
          </h1>
            <p className="mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground">
            Explorá las cátedras reseñadas por estudiantes. Tocá cualquiera para ver su detalle, sus
            métricas y todas las opiniones.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-10">
        <ul className="flex flex-col">
          {catedras.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/catedra/${c.slug}`}
                className="group flex flex-wrap items-center justify-between gap-4 border-b border-border py-5 transition-colors hover:bg-card"
              >
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wider text-accent">{c.subjects.join(" / ")}</p>
                  <h2 className="mt-1 flex items-center gap-1.5 font-serif text-2xl leading-tight text-foreground">
                    {c.name}
                    <ArrowUpRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </h2>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {c.head} · {c.degrees.join(" / ")}
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="hidden text-right sm:block">
                    <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Reseñas</p>
                    <p className="font-serif text-2xl text-foreground">{c.reviews.length}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <StarRating value={c.rating} size={16} />
                    <span className="font-mono text-xs text-muted-foreground">{c.rating.toFixed(1)} / 5</span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

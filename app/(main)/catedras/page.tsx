import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { departmentService } from "@/lib/api/services/department.service.server"

export default async function CatedrasPage() {
  const catedras = await departmentService.getAll()

  return (
    <main className="bg-background min-h-screen">
      <section className="">
        <div className="mx-auto max-w-5xl px-6 pt-12">
          <p className="text-accent font-mono text-xs tracking-[0.2em] uppercase">
            Experiencias de cursadas · escritas por estudiantes
          </p>
          <h1 className="text-foreground mt-2.5 text-4xl leading-[1.05] font-bold tracking-tight text-balance sm:text-3xl">
            Cátedras
          </h1>
          <p className="text-muted-foreground mt-4 max-w-xl leading-relaxed text-pretty">
            Explorá cátedras. Tocá cualquiera para ver su detalle, sus métricas y todas las
            opiniones.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-10">
        <ul className="flex flex-col">
          {catedras.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/catedra/${c.slug}`}
                className="group border-border hover:bg-card flex flex-wrap items-center justify-between gap-4 border-b py-5 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-accent text-xs font-medium tracking-wider uppercase">
                    {c.subjects.join(" / ")}
                  </p>
                  <h2 className="text-foreground mt-1 flex items-center gap-1.5 font-serif text-2xl leading-tight">
                    {c.name}
                    <ArrowUpRight className="text-muted-foreground size-4 opacity-0 transition-opacity group-hover:opacity-100" />
                  </h2>
                  <p className="text-muted-foreground mt-0.5 text-sm">
                    {c.head} · {c.degrees.join(" / ")}
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="hidden text-right sm:block">
                    <p className="text-muted-foreground font-mono text-xs tracking-wider uppercase">
                      Experiencias
                    </p>
                    <p className="text-foreground font-serif text-2xl">{c.reviews.length}</p>
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

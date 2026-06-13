import Link from "next/link"
import { GraduationCap, ArrowRight } from "lucide-react"
import { degreeService } from "@/lib/api/services/degree.service.server"
import AppHeader from "@/app/components/ui/app-header"

export const metadata = {
  title: "Carreras · faduHub",
  description: "Explorá las carreras de FADU.",
}

export default async function CarrerasPage() {
  const degrees = await degreeService.getAll()

  return (
    <main className="bg-background min-h-screen">
      <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
        <AppHeader title="Carreras" />

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {degrees.map((degree) => (
            <Link
              key={degree.id}
              href={`/carreras/${degree.slug}`}
              className="border-border bg-card/80 hover:border-primary/40 group flex items-center gap-4 rounded-2xl border p-5 transition-colors"
            >
              <div className="relative shrink-0">
                <div className="bg-primary/30 absolute inset-0 rounded-full blur-lg" />
                <div className="bg-primary/10 ring-primary/20 relative flex size-11 items-center justify-center rounded-xl ring-1">
                  <GraduationCap className="text-primary size-5" strokeWidth={1.5} />
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-foreground truncate text-sm font-medium">{degree.name}</p>
                <p className="text-muted-foreground font-mono text-[0.65rem] tracking-[0.14em] uppercase">
                  {degree.slug}
                </p>
              </div>

              <ArrowRight
                className="text-muted-foreground group-hover:text-primary size-4 shrink-0 transition-colors group-hover:translate-x-0.5"
                strokeWidth={1.5}
              />
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}

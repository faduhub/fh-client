import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getCatedras, getMaterias, getTags, getCarreras } from "@/lib/api"
import { SiteHeader } from "@/app/components/site-header"
import { ReviewForm } from "./review-form"

export default async function NuevaResenaPage() {

  const [catedras, materias, tags, carreras] = await Promise.all([getCatedras(), getMaterias(), getTags(), getCarreras()])

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />

      <section className="border-b border-border">
        <div className="mx-auto max-w-3xl px-6 py-12">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Volver al inicio
          </Link>

          <h1 className="mt-6 font-serif text-4xl leading-tight text-foreground sm:text-5xl">
            Nueva reseña
          </h1>
          <p className="mt-2 text-muted-foreground">
            Compartí tu experiencia con la comunidad de FaduHub.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-12">
        <ReviewForm catedras={catedras} materias={materias} tags={tags} carreras={carreras} />
      </section>
    </main>
  )
}

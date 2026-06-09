import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ThumbsUp, Star, Check } from "lucide-react"
import { getUsuario, getUsuarios } from "@/lib/data"
import { SiteHeader } from "@/app/components/site-header"
import { ReviewCard } from "@/app/components/review-card"
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar"

export function generateStaticParams() {
  return getUsuarios().map((u) => ({ slug: u.slug }))
}

function StatBox({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode
  value: string
  label: string
}) {
  return (
    <div className="flex flex-col gap-1 border border-border bg-card p-5">
      <div className="flex items-center gap-1.5 text-muted-foreground">{icon}</div>
      <p className="font-serif text-3xl leading-none text-foreground">{value}</p>
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  )
}

export default async function UsuarioPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const usuario = getUsuario(slug)
  if (!usuario) notFound()

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />

      <section className="border-b border-border">
        <div className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
          <Link
            href="/#reseñas"
            className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Volver a reseñas
          </Link>

          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center">
            <Avatar className="size-20 border border-border">
              <AvatarFallback className="bg-secondary font-serif text-2xl text-secondary-foreground">
                {usuario.iniciales}
              </AvatarFallback>
            </Avatar>
            <div className="max-w-2xl">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
                {usuario.carrera} · {usuario.cuatrimestre}
              </p>
              <h1 className="mt-2 font-serif text-5xl leading-tight text-foreground">{usuario.nombre}</h1>
              <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">{usuario.bio}</p>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatBox
              icon={<Star className="size-4" />}
              value={String(usuario.reviews.length)}
              label="Reseñas"
            />
            <StatBox
              icon={<Star className="size-4" />}
              value={usuario.promedioPuntaje.toFixed(1)}
              label="Puntaje medio"
            />
            <StatBox
              icon={<ThumbsUp className="size-4" />}
              value={String(usuario.totalLikes)}
              label="Likes recibidos"
            />
            <StatBox
              icon={<Check className="size-4" />}
              value={`${usuario.recomiendaPct}%`}
              label="Recomienda"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <h2 className="mb-6 border-b border-border pb-4 font-serif text-2xl text-foreground">
          Reseñas de {usuario.nombre.split(" ")[0]}
        </h2>
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          {usuario.reviews.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
      </section>
    </main>
  )
}

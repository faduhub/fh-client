import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ThumbsUp, Star, Check } from "lucide-react"
import { userService } from "@/lib/api/services/user.service.server"
import { ReviewCard } from "@/app/components/review-card"
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar"

function StatBox({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="border-border bg-card flex flex-col gap-1 border p-5">
      <div className="text-muted-foreground flex items-center gap-1.5">{icon}</div>
      <p className="text-foreground font-serif text-3xl leading-none">{value}</p>
      <p className="text-muted-foreground text-xs tracking-wider uppercase">{label}</p>
    </div>
  )
}

export default async function UsuarioPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const usuario = await userService.getBySlug(slug)
  if (!usuario) notFound()

  const cuatrimestre = usuario.reviews[0]?.term ?? ""

  return (
    <main className="bg-background min-h-screen">
      <section className="border-border border-b">
        <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
          <Link
            href="/reseñas"
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-xs font-medium tracking-wider uppercase transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            Volver a reseñas
          </Link>

          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center">
            <Avatar className="border-border size-20 border">
              <AvatarFallback className="bg-secondary text-secondary-foreground font-serif text-2xl">
                {usuario.initials}
              </AvatarFallback>
            </Avatar>
            <div className="max-w-2xl">
              <p className="text-accent font-mono text-xs tracking-[0.2em] uppercase">
                {usuario.degrees.map((c) => c.name).join(" / ")} · {cuatrimestre}
              </p>
              <h1 className="text-foreground mt-2 font-serif text-5xl leading-tight">
                {usuario.name}
              </h1>
              <p className="text-muted-foreground mt-3 leading-relaxed text-pretty">
                {usuario.bio}
              </p>
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
              value={usuario.avgRating.toFixed(1)}
              label="Puntaje medio"
            />
            <StatBox
              icon={<ThumbsUp className="size-4" />}
              value={String(usuario.totalLikes)}
              label="Likes recibidos"
            />
            <StatBox
              icon={<Check className="size-4" />}
              value={`${usuario.recommendPct}%`}
              label="Recomienda"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="border-border text-foreground mb-6 border-b pb-4 font-serif text-2xl">
          Reseñas de {usuario.name.split(" ")[0]}
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

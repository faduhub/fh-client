import { notFound } from "next/navigation"
import { userService } from "@/lib/api/services/user.service.server"
import { ReviewCard } from "@/app/components/review-card"
import { ProfileHeader } from "@/app/components/ui/profile-headbar"
import { Sidebar } from "@/app/components/ui/profile-sidebar"
import { CurrentCourses } from "@/app/components/ui/current-courses"
import { Achievements } from "@/app/components/ui/achievements"
import { ReviewFilters } from "@/app/components/ui/review-filters"

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
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* Gradientes de fondo sutiles */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
      >
        <div className="absolute -left-40 -top-40 size-[36rem] rounded-full bg-primary/15 blur-[120px]" />
        <div className="absolute -right-40 top-1/3 size-[32rem] rounded-full bg-accent/15 blur-[120px]" />
      </div>

      <main className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:py-12">
        <ProfileHeader />

        <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
          {/* Sidebar sticky */}
          <aside className="flex flex-col gap-6 lg:sticky lg:top-8 lg:w-[20rem] lg:shrink-0">
            <Sidebar />
            <CurrentCourses />
            <Achievements />
          </aside>

          {/* Reseñas */}
          <section className="min-w-0 flex-1">
            <div className="flex items-end justify-between gap-4">
              <div>
                <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-primary">
                  USR_01 / Reseñas
                </span>
                <h2 className="mt-1 font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
                  Reseñas de Martina
                </h2>
              </div>
              <span
                aria-hidden="true"
                className="hidden font-serif text-5xl font-medium leading-none text-primary/30 sm:block"
              >
                01
              </span>
            </div>
            <div className="mt-5 h-px w-full bg-gradient-to-r from-primary/60 via-border to-transparent" />

            <div className="mt-6">
              <ReviewFilters />
            </div>

            <div className="mt-7 flex flex-col gap-5">
             {usuario.reviews.length && usuario.reviews?.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>              
          </section>
        </div>
      </main>
    </div>
  )
}

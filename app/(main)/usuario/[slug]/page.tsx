import { ProfileSidebar } from "../../../components/ui/profile-sidebar"
import { ReviewCard } from "../../../components/ui/review-card"
import { Achievements } from "../../../components/ui/achievements"
import { CurrentCourses } from "../../../components/ui/current-courses"
import { userService } from "@/lib/api/services/user.service.server"
import { notFound } from "next/navigation"

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const user = await userService.getBySlug(slug)

  if (!user) notFound()
  console.log(user)
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* Gradientes de fondo sutiles */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
        <div className="bg-primary/15 absolute -top-40 -left-40 size-144 rounded-full blur-[120px]" />
        <div className="bg-accent/15 size-128ß absolute top-1/3 -right-40 rounded-full blur-[120px]" />
      </div>

      <main className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:py-12">
        <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
          {/* Sidebar sticky */}
          <aside className="flex flex-col gap-6 lg:sticky lg:top-7 lg:w-[20rem] lg:shrink-0">
            <ProfileSidebar user={user} />
            <CurrentCourses />
            <Achievements />
          </aside>

          <section className="min-w-0 flex-1">
            <div className="flex flex-col gap-5">
              {user.reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

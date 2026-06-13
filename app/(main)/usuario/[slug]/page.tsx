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

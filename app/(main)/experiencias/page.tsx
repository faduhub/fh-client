import { reviewService } from "@/lib/api/services/review.service.server"
import { degreeService } from "@/lib/api/services/degree.service.server"
import { subjectService } from "@/lib/api/services/subject.service.server"
import { accountService } from "@/lib/api/services/account.service.server"
import { ReviewsFeed } from "@/components/features/reviews-feed"
import AppHeader from "@/app/components/ui/app-header"

export default async function ExperienciasPage() {
  const [reviews, degrees, subjects, me] = await Promise.all([
    reviewService.getAll(),
    degreeService.getAll(),
    subjectService.getAll(),
    accountService.getMe(),
  ])

  return (
    <main className="bg-background min-h-screen">
      <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
        <AppHeader title="Experiencias" />

        <section id="experiencias" className="mx-auto py-8">
          <ReviewsFeed
            reviews={reviews}
            degrees={degrees}
            subjects={subjects}
            currentUserSlug={me?.slug ?? null}
          />
        </section>
      </div>
    </main>
  )
}

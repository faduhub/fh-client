import { ReviewCard } from "@/components/features/review-card"
import { SectionCard } from "@/app/components/ui/section-card"
import { accountService } from "@/lib/api/services/account.service.server"
import { userService } from "@/lib/api/services/user.service.server"

export default async function ExperienciasTabPage() {
  const me = await accountService.getMe()
  if (!me?.slug) return null

  const profile = await userService.getBySlug(me.slug)
  const reviews = profile?.reviews ?? []

  if (reviews.length === 0) {
    return (
      <SectionCard title="Experiencias" description="Acá vas a ver las experiencias que dejaste.">
        <p className="text-muted-foreground text-sm">Todavía no dejaste ninguna experiencia.</p>
      </SectionCard>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} currentUserSlug={me.slug} />
      ))}
    </div>
  )
}

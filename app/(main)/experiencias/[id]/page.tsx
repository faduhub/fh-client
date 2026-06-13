import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { reviewService } from "@/lib/api/services/review.service.server"
import { commentService } from "@/lib/api/services/comment.service.server"
import { ReviewCard } from "@/app/components/review-card"
import { CommentSection } from "./comment-section"

export default async function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [review, comments] = await Promise.all([
    reviewService.getById(id),
    commentService.getByReview(id),
  ])
  if (!review) notFound()

  return (
    <main className="bg-background min-h-screen">
      <section className="mx-auto max-w-3xl px-6 pt-12">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="size-4" />
          Volver
        </Link>
      </section>

      <section className="mx-auto flex max-w-3xl flex-col gap-10 px-6 py-8">
        <ReviewCard review={review} linked={false} />
        <CommentSection reviewId={id} initialComments={comments.data} />
      </section>
    </main>
  )
}

import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { reviewService } from "@/lib/api/services/review.service.server"
import type { Comment } from "@/lib/api/dtos/responses/comment"
import { ReviewCard } from "@/app/components/review-card"
import { CommentSection } from "./comment-section"

// Mock para visualizar el detalle hasta que exista el backend de comentarios.
const MOCK_COMMENTS: Comment[] = [
  {
    id: "c1",
    author: "Lucía Fernández",
    authorSlug: "lucia-fernandez",
    initials: "LF",
    date: "hace 2 días",
    body: "Coincido totalmente, la cursada fue muy llevadera y los TPs súper claros.",
    likes: 4,
  },
  {
    id: "c2",
    author: "Martín Gómez",
    authorSlug: "martin-gomez",
    initials: "MG",
    date: "hace 5 horas",
    body: "A mí me costó un poco más la parte teórica, pero los docentes siempre estuvieron disponibles para consultas.",
    likes: 1,
  },
]

export default async function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const review = await reviewService.getById(id)
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
        <CommentSection initialComments={MOCK_COMMENTS} />
      </section>
    </main>
  )
}

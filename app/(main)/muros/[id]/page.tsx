import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { postService } from "@/lib/api/services/post.service.server"
import { commentService } from "@/lib/api/services/comment.service.server"
import { accountService } from "@/lib/api/services/account.service.server"
import { ApiError } from "@/lib/api/http.server"
import { PostDetail } from "./post-detail"

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const [me, commentsResult] = await Promise.all([
    accountService.getMe(),
    commentService.getByPost(id),
  ])

  let post
  try {
    post = await postService.getById(id)
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound()
    throw e
  }

  return (
    <main className="bg-background min-h-screen">
      <section className="mx-auto max-w-3xl px-6 pt-12">
        <Link
          href="/muros"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="size-4" />
          Muros
        </Link>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-8">
        <PostDetail
          initialPost={post}
          initialComments={commentsResult.data}
          meSlug={me?.slug ?? null}
        />
      </section>
    </main>
  )
}

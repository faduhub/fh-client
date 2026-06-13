import { Suspense } from "react"
import { postService } from "@/lib/api/services/post.service.server"
import { accountService } from "@/lib/api/services/account.service.server"
import { PostsFeed } from "./posts-feed"
import AppHeader from "@/app/components/ui/app-header"

export default async function MurosPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; order?: string; page?: string }>
}) {
  const sp = await searchParams
  const search = sp.search ?? ""
  const order = sp.order ?? "recent"
  const page = Math.max(1, Number(sp.page ?? 1))

  const [result, me] = await Promise.all([
    postService.getPosts({
      search: search || undefined,
      orderBy: order === "top" ? "likes" : undefined,
      order: order === "top" ? "DESC" : undefined,
      page,
      limit: 20,
    }),
    accountService.getMe(),
  ])

  return (
    <main className="bg-background min-h-screen">
      <div className="relative mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
        <AppHeader title="Muros" />

        <section className="mt-8">
          <Suspense>
            <PostsFeed result={result} meSlug={me?.slug ?? null} />
          </Suspense>
        </section>
      </div>
    </main>
  )
}

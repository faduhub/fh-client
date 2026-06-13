import { Suspense } from "react"
import { postService } from "@/lib/api/services/post.service.server"
import { accountService } from "@/lib/api/services/account.service.server"
import { PostsFeed } from "./posts-feed"

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
      <section className="">
        <div className="mx-auto max-w-3xl px-6 pt-12">
          <p className="text-accent font-mono text-xs tracking-[0.2em] uppercase">
            Comunidad · FADU
          </p>
          <h1 className="text-foreground mt-2.5 text-4xl leading-[1.05] font-bold tracking-tight text-balance sm:text-3xl">
            Muros
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Posts de la comunidad: preguntas, debates y novedades de materias y cátedras.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-10">
        <Suspense>
          <PostsFeed result={result} meSlug={me?.slug ?? null} />
        </Suspense>
      </section>
    </main>
  )
}
